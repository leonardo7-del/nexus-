<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpCodeMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Throwable;

class OtpPasswordResetController extends Controller
{
    public function send(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        /** @var User|null $user */
        $user = User::query()->where('email', $data['email'])->first();

        if (! $user) {
            return back()->with('status', 'Si el correo existe, enviamos un código OTP.');
        }

        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = Carbon::now()->addMinutes(5);

        DB::table('otp_codes')->insert([
            'user_id' => $user->id,
            'code' => $otp,
            'expires_at' => $expiresAt,
            'used' => 0,
        ]);

        $statusMessage = 'Te enviamos un código OTP a tu correo.';

        try {
            Mail::to($user->email)->send(
                new OtpCodeMail(
                    subjectLine: 'Código OTP para recuperar contraseña',
                    title: 'Recuperación de contraseña',
                    description: 'Usa este código para continuar con el cambio de tu contraseña.',
                    code: $otp,
                    expiresInMinutes: 5,
                )
            );
        } catch (Throwable $exception) {
            Log::error('OTP password reset mail delivery failed.', [
                'email' => $user->email,
                'error' => $exception->getMessage(),
            ]);

            if (app()->environment('local')) {
                $statusMessage = "No se pudo enviar el correo. OTP de prueba: {$otp}";
            }
        }

        $request->session()->put('password_reset_otp_user_id', $user->id);
        $request->session()->put('password_reset_otp_email', $user->email);

        return back()->with('status', $statusMessage);
    }

    public function verify(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $pendingUserId = $request->session()->get('password_reset_otp_user_id');
        $pendingEmail = $request->session()->get('password_reset_otp_email');

        if (! $pendingUserId || ! $pendingEmail) {
            throw ValidationException::withMessages([
                'code' => 'Primero solicita un código OTP.',
            ]);
        }

        $otpRecord = DB::table('otp_codes')
            ->where('user_id', $pendingUserId)
            ->where('used', 0)
            ->orderByDesc('id')
            ->first();

        if (! $otpRecord) {
            throw ValidationException::withMessages([
                'code' => 'No hay un código OTP disponible.',
            ]);
        }

        $isExpired = Carbon::parse((string) $otpRecord->expires_at)->lte(Carbon::now());
        $isSameCode = hash_equals((string) $otpRecord->code, $data['code']);

        if (! $isSameCode || $isExpired) {
            throw ValidationException::withMessages([
                'code' => $isExpired
                    ? 'El código OTP expiró. Solicita uno nuevo.'
                    : 'El código OTP no es válido.',
            ]);
        }

        DB::table('otp_codes')
            ->where('id', $otpRecord->id)
            ->update(['used' => 1]);

        /** @var User|null $user */
        $user = User::query()->where('id', (int) $pendingUserId)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'code' => 'No se pudo continuar con la recuperación.',
            ]);
        }

        $token = Password::broker(config('fortify.passwords'))->createToken($user);

        $request->session()->forget([
            'password_reset_otp_user_id',
            'password_reset_otp_email',
        ]);

        return redirect()->route('password.reset', [
            'token' => $token,
            'email' => $user->email,
        ]);
    }
}

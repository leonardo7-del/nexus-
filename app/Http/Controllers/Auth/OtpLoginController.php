<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpCodeMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OtpLoginController extends Controller
{
    private const MAX_FAILED_ATTEMPTS = 5;
    private const BRUTE_FORCE_WINDOW_MINUTES = 2;

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var User|null $user */
        $user = User::query()->where('email', $credentials['email'])->first();

        if ($this->hasTooManyFailedAttempts($request, $user, $credentials['email'])) {
            $this->audit('LOGIN_BLOCKED', $user?->id, $request, [
                'email' => $credentials['email'],
                'reason' => 'too_many_failed_attempts',
            ]);

            throw ValidationException::withMessages([
                'email' => 'Cuenta o IP bloqueada por demasiados intentos fallidos.',
            ]);
        }

        if (! $user || ! password_verify($credentials['password'], (string) $user->password_hash)) {
            $this->audit(
                'LOGIN_ATTEMPT_FAILED',
                $user?->id,
                $request,
                ['email' => $credentials['email']]
            );

            throw ValidationException::withMessages([
                'email' => 'Las credenciales no son válidas.',
            ]);
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
                    subjectLine: 'Código OTP de acceso',
                    title: 'Verificación de inicio de sesión',
                    description: 'Usa este código para continuar con el acceso a tu cuenta.',
                    code: $otp,
                    expiresInMinutes: 5,
                )
            );
        } catch (Throwable $exception) {
            Log::error('OTP login mail delivery failed.', [
                'email' => $user->email,
                'error' => $exception->getMessage(),
            ]);

            if (app()->environment('local')) {
                $statusMessage = "No se pudo enviar el correo. OTP de prueba: {$otp}";
            }
        }

        $request->session()->put('otp_pending_user_id', $user->id);
        $request->session()->put('otp_pending_email', $user->email);

        $this->audit('LOGIN_ATTEMPT_SUCCESS', $user->id, $request, [
            'email' => $user->email,
        ]);

        return redirect()->route('otp.form')
            ->with('status', $statusMessage);
    }

    public function showOtpForm(Request $request): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        $pendingUserId = $request->session()->get('otp_pending_user_id');

        if (! $pendingUserId) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/otp', [
            'status' => $request->session()->get('status'),
            'email' => $request->session()->get('otp_pending_email'),
        ]);
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $pendingUserId = $request->session()->get('otp_pending_user_id');

        if (! $pendingUserId) {
            return redirect()->route('login');
        }

        /** @var User|null $pendingUser */
        $pendingUser = User::query()->find((int) $pendingUserId);

        if ($this->hasTooManyFailedAttempts($request, $pendingUser)) {
            $this->audit('OTP_VERIFICATION_BLOCKED', (int) $pendingUserId, $request, [
                'reason' => 'too_many_failed_attempts',
            ]);

            throw ValidationException::withMessages([
                'code' => 'Cuenta o IP bloqueada por demasiados intentos fallidos.',
            ]);
        }

        $otpRecord = DB::table('otp_codes')
            ->where('user_id', $pendingUserId)
            ->where('used', 0)
            ->orderByDesc('id')
            ->first();

        if (! $otpRecord) {
            $this->audit('OTP_VERIFICATION_FAILED', $pendingUserId, $request, [
                'reason' => 'no_otp_found',
            ]);

            throw ValidationException::withMessages([
                'code' => 'No hay un código OTP disponible.',
            ]);
        }

        $isExpired = Carbon::parse((string) $otpRecord->expires_at)->lte(Carbon::now());
        $isSameCode = hash_equals((string) $otpRecord->code, $data['code']);

        if (! $isSameCode || $isExpired) {
            $this->audit('OTP_VERIFICATION_FAILED', $pendingUserId, $request, [
                'reason' => $isExpired ? 'expired' : 'invalid_code',
            ]);

            throw ValidationException::withMessages([
                'code' => $isExpired
                    ? 'El código OTP expiró. Inicia sesión otra vez.'
                    : 'El código OTP no es válido.',
            ]);
        }

        DB::table('otp_codes')
            ->where('id', $otpRecord->id)
            ->update(['used' => 1]);

        Auth::loginUsingId((int) $pendingUserId);
        $request->session()->forget(['otp_pending_user_id', 'otp_pending_email']);
        $request->session()->regenerate();

        $this->audit('OTP_VERIFICATION_SUCCESS', (int) $pendingUserId, $request, [
            'otp_code_id' => $otpRecord->id,
        ]);

        return redirect()->intended(route('dashboard'));
    }

    private function audit(string $action, ?int $userId, Request $request, array $details = []): void
    {
        DB::table('audit_logs')->insert([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $request->ip(),
            'details' => json_encode($details, JSON_UNESCAPED_UNICODE),
            'created_at' => now(),
        ]);
    }

    private function hasTooManyFailedAttempts(Request $request, ?User $user = null, ?string $email = null): bool
    {
        $actions = ['LOGIN_ATTEMPT_FAILED', 'OTP_VERIFICATION_FAILED'];
        $windowStart = Carbon::now()->subMinutes(self::BRUTE_FORCE_WINDOW_MINUTES);

        $ipFailures = DB::table('audit_logs')
            ->whereIn('action', $actions)
            ->where('ip_address', $request->ip())
            ->where('created_at', '>=', $windowStart)
            ->count();

        if ($ipFailures >= self::MAX_FAILED_ATTEMPTS) {
            return true;
        }

        if ($user) {
            $userFailures = DB::table('audit_logs')
                ->whereIn('action', $actions)
                ->where('user_id', $user->id)
                ->where('created_at', '>=', $windowStart)
                ->count();

            if ($userFailures >= self::MAX_FAILED_ATTEMPTS) {
                return true;
            }
        }

        if ($email !== null) {
            $emailFailures = DB::table('audit_logs')
                ->where('action', 'LOGIN_ATTEMPT_FAILED')
                ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(details, '$.email')) = ?", [$email])
                ->where('created_at', '>=', $windowStart)
                ->count();

            if ($emailFailures >= self::MAX_FAILED_ATTEMPTS) {
                return true;
            }
        }

        return false;
    }
}

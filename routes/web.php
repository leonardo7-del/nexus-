<?php

use App\Http\Controllers\Auth\OtpLoginController;
use App\Http\Controllers\Auth\OtpPasswordResetController;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::post('login', [OtpLoginController::class, 'login'])->name('login.store');
    Route::get('otp', [OtpLoginController::class, 'showOtpForm'])->name('otp.form');
    Route::post('otp', [OtpLoginController::class, 'verifyOtp'])->name('otp.verify');
    Route::post('forgot-password/otp', [OtpPasswordResetController::class, 'send'])->name('password.otp.send');
    Route::post('forgot-password/otp/verify', [OtpPasswordResetController::class, 'verify'])->name('password.otp.verify');
});

Route::get('dashboard', function () {
    $auditLogs = DB::table('audit_logs')
        ->select(['id', 'user_id', 'action', 'ip_address', 'details', 'created_at'])
        ->orderByDesc('id')
        ->limit(100)
        ->get()
        ->map(function (object $log): array {
            $decodedDetails = null;

            if (is_string($log->details) && $log->details !== '') {
                $decoded = json_decode($log->details, true);
                $decodedDetails = is_array($decoded) ? $decoded : $log->details;
            }

            return [
                'id' => (int) $log->id,
                'user_id' => $log->user_id !== null ? (int) $log->user_id : null,
                'action' => $log->action,
                'ip_address' => $log->ip_address,
                'details' => $decodedDetails,
                'created_at' => (string) $log->created_at,
            ];
        });

    $users = User::query()
        ->select(['id', 'email', 'created_at'])
        ->orderBy('id')
        ->get()
        ->map(fn (User $user): array => [
            'id' => $user->id,
            'email' => $user->email,
            'created_at' => $user->created_at?->toDateTimeString(),
        ]);

    return Inertia::render('dashboard', [
        'auditLogs' => $auditLogs,
        'users' => $users,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';

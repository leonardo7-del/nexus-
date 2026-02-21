<?php

use App\Http\Controllers\Auth\OtpLoginController;
use App\Http\Controllers\Auth\OtpPasswordResetController;
use App\Models\User;
use Carbon\Carbon;
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

    $totalEvents = DB::table('audit_logs')->count();
    $successfulLogins = DB::table('audit_logs')
        ->where('action', 'OTP_VERIFICATION_SUCCESS')
        ->count();
    $failedEvents = DB::table('audit_logs')
        ->where(function ($query): void {
            $query
                ->where('action', 'like', '%FAILED%')
                ->orWhere('action', 'like', '%BLOCKED%');
        })
        ->count();
    $totalRegistrations = User::query()->count();

    $startDate = Carbon::now()->subDays(6)->startOfDay();

    $loginsByDay = DB::table('audit_logs')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
        ->where('action', 'OTP_VERIFICATION_SUCCESS')
        ->where('created_at', '>=', $startDate)
        ->groupByRaw('DATE(created_at)')
        ->pluck('total', 'day');

    $failedByDay = DB::table('audit_logs')
        ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
        ->where(function ($query): void {
            $query
                ->where('action', 'like', '%FAILED%')
                ->orWhere('action', 'like', '%BLOCKED%');
        })
        ->where('created_at', '>=', $startDate)
        ->groupByRaw('DATE(created_at)')
        ->pluck('total', 'day');

    $dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    $activitySeries = collect(range(0, 6))
        ->map(function (int $offset) use ($startDate, $dayLabels, $loginsByDay, $failedByDay): array {
            $date = $startDate->copy()->addDays($offset);
            $isoDate = $date->toDateString();

            return [
                'date' => $isoDate,
                'label' => $dayLabels[$date->dayOfWeek],
                'logins' => (int) ($loginsByDay[$isoDate] ?? 0),
                'failed' => (int) ($failedByDay[$isoDate] ?? 0),
            ];
        })
        ->values();

    $users = DB::table('users')
        ->select(['id', 'email', 'password_hash', 'remember_token', 'created_at'])
        ->orderByDesc('id')
        ->get()
        ->map(fn (object $user): array => [
            'id' => (int) $user->id,
            'email' => (string) $user->email,
            'password_hash' => (string) $user->password_hash,
            'remember_token' => $user->remember_token !== null ? (string) $user->remember_token : null,
            'created_at' => (string) $user->created_at,
        ]);

    return Inertia::render('dashboard', [
        'auditLogs' => $auditLogs,
        'metrics' => [
            'total_events' => $totalEvents,
            'logins_ok' => $successfulLogins,
            'registrations' => $totalRegistrations,
            'failed' => $failedEvents,
        ],
        'activity' => $activitySeries,
        'users' => $users,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';

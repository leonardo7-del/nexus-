<?php

use App\Http\Controllers\Auth\OtpLoginController;
use App\Http\Controllers\Auth\OtpPasswordResetController;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
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
        ->select(['id', 'email', 'created_at'])
        ->orderByDesc('id')
        ->get()
        ->map(fn (object $user): array => [
            'id' => (int) $user->id,
            'email' => (string) $user->email,
            'created_at' => (string) $user->created_at,
        ]);

    $otpCodes = collect();

    if (Schema::hasTable('otp_codes')) {
        $otpCodes = DB::table('otp_codes')
            ->select(['id', 'user_id', 'code', 'expires_at', 'used'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (object $otp): array => [
                'id' => (int) $otp->id,
                'user_id' => (int) $otp->user_id,
                'code' => (string) $otp->code,
                'expires_at' => (string) $otp->expires_at,
                'used' => (int) $otp->used === 1,
            ]);
    }

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
        'otpCodes' => $otpCodes,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('dashboard/export-records', function () {
    if (! class_exists(\ZipArchive::class)) {
        abort(500, 'La extension ZIP no esta habilitada en el servidor.');
    }

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
        })
        ->values()
        ->all();

    $users = DB::table('users')
        ->select(['id', 'email', 'created_at'])
        ->orderByDesc('id')
        ->get()
        ->map(fn (object $user): array => [
            'id' => (int) $user->id,
            'email' => (string) $user->email,
            'created_at' => (string) $user->created_at,
        ])
        ->values()
        ->all();

    $otpCodes = [];

    if (Schema::hasTable('otp_codes')) {
        $otpCodes = DB::table('otp_codes')
            ->select(['id', 'user_id', 'code', 'expires_at', 'used'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (object $otp): array => [
                'id' => (int) $otp->id,
                'user_id' => (int) $otp->user_id,
                'code' => (string) $otp->code,
                'expires_at' => (string) $otp->expires_at,
                'used' => (int) $otp->used === 1,
            ])
            ->values()
            ->all();
    }

    $now = now();
    $stamp = $now->format('Y-m-d_H-i-s');
    $txtName = "registros-completos-{$stamp}.txt";
    $zipName = "registros-completos-{$stamp}.zip";

    $content = "NEXUS - EXPORTACION DE REGISTROS\n";
    $content .= 'Generado: '.$now->toDateTimeString()."\n\n";
    $content .= 'Totales: audit_logs='.count($auditLogs).', users='.count($users).', otp_codes='.count($otpCodes)."\n\n";
    $content .= "===== AUDIT_LOGS =====\n";
    $content .= json_encode($auditLogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)."\n\n";
    $content .= "===== USERS =====\n";
    $content .= json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)."\n\n";
    $content .= "===== OTP_CODES =====\n";
    $content .= json_encode($otpCodes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)."\n";

    $zipPath = tempnam(sys_get_temp_dir(), 'nexus_export_');
    $zip = new \ZipArchive();

    if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
        abort(500, 'No se pudo crear el archivo ZIP.');
    }

    $zip->addFromString($txtName, $content);
    $zip->close();

    return response()->download($zipPath, $zipName)->deleteFileAfterSend(true);
})->middleware(['auth', 'verified'])->name('dashboard.export-records');

require __DIR__.'/settings.php';

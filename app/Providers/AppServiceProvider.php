<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use RuntimeException;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->validateDatabaseConfiguration();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }

    /**
     * Fail fast with a clear message when production DB credentials are incomplete.
     */
    protected function validateDatabaseConfiguration(): void
    {
        if (! app()->isProduction()) {
            return;
        }

        $connection = (string) config('database.default');

        if (! in_array($connection, ['mysql', 'mariadb'], true)) {
            return;
        }

        $password = config("database.connections.{$connection}.password");
        $databaseUrl = config("database.connections.{$connection}.url");
        $urlPassword = is_string($databaseUrl) ? parse_url($databaseUrl, PHP_URL_PASS) : null;

        $hasScalarPassword = is_string($password) && trim($password) !== '';
        $hasUrlPassword = is_string($urlPassword) && trim($urlPassword) !== '';

        if (! $hasScalarPassword && ! $hasUrlPassword) {
            throw new RuntimeException(
                'Database password is empty in production. Set DB_PASSWORD (or MYSQLPASSWORD) and clear config cache.'
            );
        }
    }
}

<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;

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
        $this->ensureDatabaseReady();
        $this->configureDefaults();

        Inertia::share([
            'adminRecentNotifications' => function () {
                if (Auth::check() && Auth::user()->isAdmin()) {
                    return DatabaseNotification::latest()->take(5)->get();
                }
                return [];
            },
        ]);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function ensureDatabaseReady(): void
    {
        try {
            $dirs = [
                storage_path('framework/sessions'),
                storage_path('framework/cache/data'),
                storage_path('framework/views'),
                storage_path('logs'),
            ];
            foreach ($dirs as $dir) {
                if (!is_dir($dir)) {
                    @mkdir($dir, 0755, true);
                }
            }

            $dbPath = config('database.connections.sqlite.database');
            if ($dbPath && !file_exists($dbPath)) {
                $dir = dirname($dbPath);
                if (!is_dir($dir)) {
                    @mkdir($dir, 0755, true);
                }
                @touch($dbPath);
            }

            if (app()->isProduction() && !$this->migrationsHaveRun()) {
                Artisan::call('migrate', ['--force' => true]);
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    protected function migrationsHaveRun(): bool
    {
        try {
            DB::select('select 1 from migrations limit 1');
            return true;
        } catch (\Throwable) {
            return false;
        }
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        if (app()->isProduction()) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
            : null,
        );
    }
}

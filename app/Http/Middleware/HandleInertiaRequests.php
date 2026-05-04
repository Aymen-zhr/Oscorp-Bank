<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use App\Traits\HasOscorpBalance;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    use HasOscorpBalance;

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = $request->cookie('locale', config('app.locale', 'en'));
        $user = Auth::user();
        $stats = $user ? $this->getFinancialStats() : null;
        
        $preferences = $user ? ($user->preferences ?? []) : [];
        $currency = $preferences['currency'] ?? 'MAD';

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'unreadNotificationsCount' => $user->unreadNotifications()->count(),
                    'recentNotifications' => $user->unreadNotifications()->limit(config('oscorp.limits.notifications_recent', 5))->get(),
                ]) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => $locale,
            'isRTL' => false, // Always LTR as requested
            'balance' => $stats ? round($stats['live_balance'], 2) : 0,
            'total_credits' => $stats ? round($stats['total_credits'], 2) : 0,
            'total_debits' => $stats ? round($stats['total_debits'], 2) : 0,
            'monthly_credits' => $stats ? round($stats['monthly_credits'], 2) : 0,
            'monthly_debits' => $stats ? round($stats['monthly_debits'], 2) : 0,
            'monthly_categories' => $stats ? $stats['monthly_categories'] : [],
            'capital_allocation' => $stats ? $stats['capital_allocation'] : [],
            'total_capital' => $stats ? ($stats['live_balance'] + $stats['goal_savings']) : 0,
            'currency' => $currency,
            'rib' => config('oscorp.rib'),
        ];
    }
}

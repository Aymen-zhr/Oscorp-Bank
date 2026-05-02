<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class AccountController extends Controller
{
    use HasOscorpBalance;

    public function cards()
    {
        $user = Auth::user();
        $stats = $this->getFinancialStats();
        
        $recentTransactions = DB::table('transactions')
            ->orderBy('transacted_at', 'desc')
            ->take(5)
            ->get();

        $cardConfig = config('oscorp.card');
        $accountConfig = config('oscorp.account');
        $ribConfig = config('oscorp.rib');
        $cardLimit = $cardConfig['limit'];

        return Inertia::render('cards', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'tag' => $user->tag,
                'created_at' => $user->created_at->toIso8601String(),
                'email_verified' => !!$user->email_verified_at,
            ],
            'card' => [
                'number' => $cardConfig['last4'],
                'full_number' => '**** **** **** ' . $cardConfig['last4'],
                'holder' => strtoupper($user->name),
                'expiry' => $cardConfig['expiry'],
                'cvv' => '***',
                'type' => 'VISA Platinum',
                'balance' => round($stats['live_balance'], 2),
                'limit' => $cardLimit,
                'available' => round($cardLimit - $stats['total_spending'], 2),
            ],
            'rib' => [
                'full' => $ribConfig['full'],
                'bank_code' => $ribConfig['bank_code'],
                'branch_code' => $ribConfig['branch_code'],
                'account_number' => $ribConfig['account_number'],
                'rib_key' => $ribConfig['rib_key'],
            ],
            'account' => [
                'number' => '0000 1234 5678 9012',
                'type' => $accountConfig['type'],
                'opened' => $user->created_at->format('d M Y'),
                'branch' => $accountConfig['branch'],
                'status' => 'Active',
            ],
            'stats' => [
                'total_credits' => round($stats['total_credits'], 2),
                'total_debits' => round($stats['total_debits'], 2),
                'transaction_count' => DB::table('transactions')->count(),
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $stats = $this->getFinancialStats();

        return Inertia::render('account', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tag' => $user->tag,
                'phone' => $user->phone ?? 'Not provided',
                'avatar' => $user->avatar,
                'created_at' => $user->created_at->format('M Y'),
                'last_login' => now()->format('d M Y, H:i'),
            ],
            'security' => [
                'two_factor_enabled' => !!$user->two_factor_secret,
                'email_verified' => !!$user->email_verified_at,
            ],
            'financial' => [
                'balance' => round($stats['live_balance'], 2),
                'total_spending' => round($stats['total_spending'], 2),
                'total_received' => round($stats['total_credits'], 2),
            ]
        ]);
    }
}

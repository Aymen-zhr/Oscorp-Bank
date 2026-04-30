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

    public function page()
    {
        $user = Auth::user();
        $stats = $this->getFinancialStats();
        
        $recentTransactions = DB::table('transactions')
            ->orderBy('transacted_at', 'desc')
            ->take(5)
            ->get();

        $cardConfig = config('oscorp.card');
        $accountConfig = config('oscorp.account');

        return Inertia::render('accounts', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->toIso8601String(),
                'email_verified' => !!$user->email_verified_at,
            ],
            'card' => [
                'number' => $cardConfig['last4'],
                'full_number' => $cardConfig['full_number'],
                'holder' => strtoupper($user->name),
                'expiry' => $cardConfig['expiry'],
                'cvv' => '***',
                'type' => 'VISA Platinum',
                'balance' => round($stats['live_balance'], 2),
                'limit' => 50000,
                'available' => round(50000 - $stats['total_spending'], 2),
            ],
            'rib' => [
                'full' => '181 810 0000000000000000 84',
                'bank_code' => '181',
                'branch_code' => '810',
                'account_number' => '0000000000000000',
                'rib_key' => '84',
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
}

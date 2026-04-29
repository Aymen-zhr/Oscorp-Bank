<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;

class DashboardController extends Controller
{
    use HasOscorpBalance;

    public function index()
    {
        $baseBalance = $this->getBaseBalance();
        
        $transactions = DB::table('transactions')
            ->orderBy('transacted_at', 'desc')
            ->take(8)
            ->get();
            
        $stats = $this->getFinancialStats();
        
        $earningsPercentage = min(99, max(5, round(($stats['live_balance'] / $baseBalance) * 58)));
            
        return Inertia::render('dashboard', [
            'balance'            => round($stats['live_balance'], 2),
            'totalSpending'      => round($stats['total_spending'], 2),
            'transactions'       => $transactions,
            'earningsPercentage' => $earningsPercentage,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // The base/seed balance of the account (before any app-inserted transactions)
    const BASE_BALANCE = 74652.00;

    public function index()
    {
        // Get recent transactions for display (newest first)
        $transactions = DB::table('transactions')
            ->orderBy('transacted_at', 'desc')
            ->take(8)
            ->get();
            
        // Calculate the true live balance:
        // credits ADD to balance, debits SUBTRACT from balance
        $totalCredits = DB::table('transactions')
            ->where('type', 'credit')
            ->sum('amount');

        $totalDebits = DB::table('transactions')
            ->where('type', 'debit')
            ->sum('amount');

        $liveBalance = self::BASE_BALANCE + $totalCredits - $totalDebits;

        // Total spending shown on the spending card (debits only)
        $totalSpending = $totalDebits + 84433; // Base seed spending for chart design

        // Earnings percentage: dynamically adjust based on balance change vs base
        $earningsPercentage = min(99, max(5, round(($liveBalance / self::BASE_BALANCE) * 58)));
            
        return Inertia::render('dashboard', [
            'balance'            => round($liveBalance, 2),
            'totalSpending'      => round($totalSpending, 2),
            'transactions'       => $transactions,
            'earningsPercentage' => $earningsPercentage,
        ]);
    }
}

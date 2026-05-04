<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

trait HasOscorpBalance
{
    protected function getBaseBalance(): float
    {
        return config('oscorp.balance.base', 12500.00);
    }

    protected function getLiveBalance(): float
    {
        $stats = $this->getTransactionSummary();
        return $this->getBaseBalance() + $stats['credits'] - $stats['debits'];
    }

    protected function getFinancialStats(): array
    {
        $baseBalance = $this->getBaseBalance();
        $summary = $this->getTransactionSummary();
        $monthly = $this->getTransactionSummary(true); 
        $categories = $this->getMonthlyCategoryBreakdown();
        
        $goalSavings = DB::table('goals')
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->sum('current_savings');

        $liveBalance = $baseBalance + $summary['credits'] - $summary['debits'];

        return [
            'base_balance' => $baseBalance,
            'total_credits' => $summary['credits'],
            'total_debits' => $summary['debits'],
            'live_balance' => $liveBalance,
            'total_spending' => $summary['debits'],
            'monthly_credits' => $monthly['credits'],
            'monthly_debits' => $monthly['debits'],
            'monthly_categories' => $categories,
            'goal_savings' => (float) $goalSavings,
            'capital_allocation' => [
                ['name' => 'Liquid Reserves', 'amount' => (float) $liveBalance, 'color' => '#D4AF37'],
                ['name' => 'Strategic Goals', 'amount' => (float) $goalSavings, 'color' => '#E5E4E2'],
                ['name' => 'Operating Flow', 'amount' => (float) $monthly['debits'], 'color' => '#8B5CF6'],
            ]
        ];
    }

    protected function getMonthlyCategoryBreakdown(): array
    {
        return DB::table('transactions')
            ->where('user_id', Auth::id())
            ->where('type', 'debit')
            ->whereMonth('transacted_at', now()->month)
            ->whereYear('transacted_at', now()->year)
            ->select('category', DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->category ?: 'Other',
                'amount' => (float) $item->total,
            ])
            ->toArray();
    }

    protected function getTransactionSummary(bool $currentMonthOnly = false): array
    {
        $userId = Auth::id();

        $query = DB::table('transactions')
            ->where('user_id', $userId);

        if ($currentMonthOnly) {
            $query->whereMonth('transacted_at', now()->month)
                  ->whereYear('transacted_at', now()->year);
        }

        $result = $query->selectRaw('
                SUM(CASE WHEN type = "credit" THEN amount ELSE 0 END) as credits,
                SUM(CASE WHEN type = "debit" THEN amount ELSE 0 END) as debits
            ')
            ->first();

        return [
            'credits' => (float) ($result->credits ?? 0),
            'debits' => (float) ($result->debits ?? 0),
        ];
    }
}
<?php

namespace App\Traits;

trait HasOscorpBalance
{
    protected function getBaseBalance(): float
    {
        return config('oscorp.balance.base', 12500.00);
    }

    protected function getLiveBalance(): float
    {
        $baseBalance = $this->getBaseBalance();
        $totalCredits = \Illuminate\Support\Facades\DB::table('transactions')
            ->where('type', 'credit')
            ->sum('amount');
        $totalDebits = \Illuminate\Support\Facades\DB::table('transactions')
            ->where('type', 'debit')
            ->sum('amount');

        return $baseBalance + $totalCredits - $totalDebits;
    }

    protected function getFinancialStats(): array
    {
        $baseBalance = $this->getBaseBalance();
        $totalCredits = \Illuminate\Support\Facades\DB::table('transactions')
            ->where('type', 'credit')
            ->sum('amount');
        $totalDebits = \Illuminate\Support\Facades\DB::table('transactions')
            ->where('type', 'debit')
            ->sum('amount');
        $liveBalance = $baseBalance + $totalCredits - $totalDebits;

        return [
            'base_balance' => $baseBalance,
            'total_credits' => $totalCredits,
            'total_debits' => $totalDebits,
            'live_balance' => $liveBalance,
            'total_spending' => $totalDebits,
        ];
    }
}
<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

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
        $liveBalance = $baseBalance + $summary['credits'] - $summary['debits'];

        return [
            'base_balance' => $baseBalance,
            'total_credits' => $summary['credits'],
            'total_debits' => $summary['debits'],
            'live_balance' => $liveBalance,
            'total_spending' => $summary['debits'],
        ];
    }

    protected function getTransactionSummary(): array
    {
        $result = DB::table('transactions')
            ->selectRaw('
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
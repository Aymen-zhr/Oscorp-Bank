<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationService
{
    public function createFinancialNotification(int $userId, string $title, string $message, string $type, float $amount, string $icon): void
    {
        DB::table('notifications')->insert([
            'id' => Str::uuid(),
            'type' => 'App\Notifications\SystemNotification',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => $userId,
            'data' => json_encode([
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'amount' => $amount,
                'icon' => $icon,
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function createDepositNotification(int $userId, float $amount, string $source): void
    {
        $this->createFinancialNotification(
            userId: $userId,
            title: 'Deposit Confirmed',
            message: number_format($amount, 2) . ' MAD deposited via ' . $source,
            type: 'deposit',
            amount: $amount,
            icon: 'credit'
        );
    }

    public function createWithdrawalNotification(int $userId, float $amount, string $source): void
    {
        $this->createFinancialNotification(
            userId: $userId,
            title: 'Withdrawal Processed',
            message: number_format($amount, 2) . ' MAD withdrawn via ' . $source,
            type: 'withdrawal',
            amount: $amount,
            icon: 'debit'
        );
    }

    public function createTransferNotification(int $userId, float $amount, string $recipient): void
    {
        $this->createFinancialNotification(
            userId: $userId,
            title: 'Transfer Completed',
            message: number_format($amount, 2) . ' MAD sent to ' . $recipient,
            type: 'transfer',
            amount: $amount,
            icon: 'debit'
        );
    }
}

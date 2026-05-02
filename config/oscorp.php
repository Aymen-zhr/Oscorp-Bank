<?php

return [
    'balance' => [
        'base' => env('BASE_BALANCE', 12500.00),
    ],
    'card' => [
        'last4' => '9984',
        'full_number' => '4589 1234 5678 9984',
        'expiry' => '12/28',
        'limit' => 50000,
    ],
    'account' => [
        'type' => 'Premium Checking',
        'branch' => 'Casablanca Central',
    ],
    'rib' => [
        'full' => '181 810 0000000000000000 84',
        'bank_code' => '181',
        'branch_code' => '810',
        'account_number' => '0000000000000000',
        'rib_key' => '84',
    ],
    'limits' => [
        'max_transfer' => 500000,
        'max_deposit' => 500000,
        'max_withdrawal' => 500000,
        'pagination' => 20,
    ],
    'colors' => [
        'deposit' => '#D4AF37',
        'withdrawal' => '#EF4444',
        'transfer' => ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
    ],
];
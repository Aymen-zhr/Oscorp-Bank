<?php

return [
    'app_name' => env('APP_NAME', 'OSCORP Banking'),
    'app_url' => env('APP_URL', ''),
    'maintenance_mode' => env('MAINTENANCE_MODE', false),
    'registration_enabled' => env('REGISTRATION_ENABLED', true),
    'min_loan_amount' => env('MIN_LOAN_AMOUNT', 1000),
    'max_loan_amount' => env('MAX_LOAN_AMOUNT', 500000),
    'default_loan_rate' => env('DEFAULT_LOAN_RATE', 5.5),
    'transfer_fee_percent' => env('TRANSFER_FEE_PERCENT', 1.5),
];

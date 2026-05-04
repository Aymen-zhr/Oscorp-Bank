<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Loan Estimation
    |--------------------------------------------------------------------------
    */
    'estimation_multiplier' => env('LOAN_ESTIMATION_MULTIPLIER', 0.15),

    /*
    |--------------------------------------------------------------------------
    | Demo Active Loans
    |--------------------------------------------------------------------------
    */
    'demo_loans' => [
        [
            'id' => 'LN-001',
            'type' => 'Home Mortgage',
            'principal' => env('LOAN_MORTGAGE_PRINCIPAL', 1200000),
            'balance' => env('LOAN_MORTGAGE_BALANCE', 985400),
            'rate' => env('LOAN_MORTGAGE_RATE', 3.5),
            'monthly_payment' => env('LOAN_MORTGAGE_MONTHLY', 8500),
            'next_payment_days' => 5,
            'term' => '20 years',
            'icon' => 'Home',
        ],
        [
            'id' => 'LN-002',
            'type' => 'Auto Loan',
            'principal' => env('LOAN_AUTO_PRINCIPAL', 250000),
            'balance' => env('LOAN_AUTO_BALANCE', 142000),
            'rate' => env('LOAN_AUTO_RATE', 4.2),
            'monthly_payment' => env('LOAN_AUTO_MONTHLY', 4800),
            'next_payment_days' => 12,
            'term' => '5 years',
            'icon' => 'Car',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Loan Offers
    |--------------------------------------------------------------------------
    */
    'offers' => [
        ['type' => 'Personal Loan', 'max_amount' => env('LOAN_PERSONAL_MAX', 500000), 'rate' => env('LOAN_PERSONAL_RATE', 5.5), 'term' => '1-5 years', 'featured' => false, 'icon' => 'User', 'pre_approved' => true],
        ['type' => 'Business Loan', 'max_amount' => env('LOAN_BUSINESS_MAX', 2000000), 'rate' => env('LOAN_BUSINESS_RATE', 4.8), 'term' => '1-10 years', 'featured' => true, 'icon' => 'Briefcase', 'pre_approved' => false],
        ['type' => 'Education Loan', 'max_amount' => env('LOAN_EDUCATION_MAX', 300000), 'rate' => env('LOAN_EDUCATION_RATE', 3.2), 'term' => '1-7 years', 'featured' => false, 'icon' => 'GraduationCap', 'pre_approved' => true],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pre-approved Limit Multiplier
    |--------------------------------------------------------------------------
    */
    'pre_approved_multiplier' => env('LOAN_PRE_APPROVED_MULTIPLIER', 3),

    /*
    |--------------------------------------------------------------------------
    | Amortization Default Months
    |--------------------------------------------------------------------------
    */
    'amortization_months' => env('LOAN_AMORTIZATION_MONTHS', 12),
];

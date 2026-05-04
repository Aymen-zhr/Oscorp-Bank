<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Moroccan Income Tax (IR) Brackets
    |--------------------------------------------------------------------------
    | Progressive tax brackets based on annual income in MAD.
    | Each bracket: [threshold, cumulative_tax, rate]
    */
    'brackets' => [
        ['threshold' => env('TAX_BRACKET_1_THRESHOLD', 30000), 'rate' => 0, 'cumulative' => 0],
        ['threshold' => env('TAX_BRACKET_2_THRESHOLD', 50000), 'rate' => 0.10, 'cumulative' => 0],
        ['threshold' => env('TAX_BRACKET_3_THRESHOLD', 60000), 'rate' => 0.20, 'cumulative' => env('TAX_BRACKET_3_CUMULATIVE', 2000)],
        ['threshold' => env('TAX_BRACKET_4_THRESHOLD', 80000), 'rate' => 0.30, 'cumulative' => env('TAX_BRACKET_4_CUMULATIVE', 4000)],
        ['threshold' => env('TAX_BRACKET_5_THRESHOLD', 180000), 'rate' => 0.34, 'cumulative' => env('TAX_BRACKET_5_CUMULATIVE', 10000)],
        ['threshold' => PHP_INT_MAX, 'rate' => 0.38, 'cumulative' => env('TAX_BRACKET_6_CUMULATIVE', 44000)],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Income Fallback
    |--------------------------------------------------------------------------
    */
    'default_income' => env('TAX_DEFAULT_INCOME', 500000),

    /*
    |--------------------------------------------------------------------------
    | Deductible Categories
    |--------------------------------------------------------------------------
    */
    'deductible_categories' => ['Health', 'Education', 'Philanthropy', 'Donations'],
];

<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Transaction Context
    |--------------------------------------------------------------------------
    */
    'transaction_context_limit' => env('AI_TRANSACTION_LIMIT', 50),

    /*
    |--------------------------------------------------------------------------
    | Budget Allocation Defaults
    |--------------------------------------------------------------------------
    */
    'budget_allocations' => [
        'essential_pct' => env('AI_BUDGET_ESSENTIAL_PCT', 0.6),
        'savings_pct' => env('AI_BUDGET_SAVINGS_PCT', 0.5),
        'discretionary_pct' => env('AI_BUDGET_DISCRETIONARY_PCT', 0.2),
        'emergency_pct' => env('AI_BUDGET_EMERGENCY_PCT', 0.5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Budget Allocation Colors
    |--------------------------------------------------------------------------
    */
    'budget_colors' => [
        'essential' => '#D4AF37',
        'savings' => '#10B981',
        'discretionary' => '#6366F1',
        'emergency' => '#F59E0B',
    ],

    /*
    |--------------------------------------------------------------------------
    | Trend Months
    |--------------------------------------------------------------------------
    */
    'trend_months' => env('AI_TREND_MONTHS', 6),
];

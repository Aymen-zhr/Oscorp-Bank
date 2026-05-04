<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Demo Asset Allocations
    |--------------------------------------------------------------------------
    */
    'demo_assets' => [
        ['name' => 'Real Estate', 'amount' => env('ALLOCATION_REAL_ESTATE', 120000)],
        ['name' => 'Vehicles', 'amount' => env('ALLOCATION_VEHICLES', 55000)],
        ['name' => 'Philanthropy', 'amount' => env('ALLOCATION_PHILANTHROPY', 15000)],
        ['name' => 'Luxury Goods', 'amount' => env('ALLOCATION_LUXURY', 8500)],
        ['name' => 'Travel', 'amount' => env('ALLOCATION_TRAVEL', 34000)],
    ],
];

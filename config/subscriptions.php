<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Subscription Billing History
    |--------------------------------------------------------------------------
    */
    'billing_history_months' => env('SUBSCRIPTION_BILLING_MONTHS', 3),

    /*
    |--------------------------------------------------------------------------
    | Demo Subscriptions
    |--------------------------------------------------------------------------
    */
    'demo_subscriptions' => [
        ['name' => 'Netflix Premium', 'plan' => 'Ultra HD 4K', 'price' => 120, 'billingCycle' => 'Monthly', 'domain' => 'netflix.com', 'daysOffset' => 12, 'monthsAgo' => 18],
        ['name' => 'Spotify Premium', 'plan' => 'Duo', 'price' => 85, 'billingCycle' => 'Monthly', 'domain' => 'spotify.com', 'daysOffset' => 5, 'monthsAgo' => 24],
        ['name' => 'Amazon Prime', 'plan' => 'Annual Membership', 'price' => 1400, 'billingCycle' => 'Yearly', 'domain' => 'amazon.com', 'daysOffset' => null, 'monthsAgo' => 32, 'monthsAhead' => 4],
        ['name' => 'Adobe Creative Cloud', 'plan' => 'All Apps', 'price' => 550, 'billingCycle' => 'Monthly', 'domain' => 'adobe.com', 'daysOffset' => 20, 'monthsAgo' => 8],
        ['name' => 'GitHub Copilot', 'plan' => 'Individual', 'price' => 100, 'billingCycle' => 'Monthly', 'domain' => 'github.com', 'daysOffset' => 2, 'monthsAgo' => 12],
        ['name' => 'Inwi Mobile', 'plan' => 'Postpaid Plan', 'price' => 200, 'billingCycle' => 'Monthly', 'domain' => 'inwi.ma', 'daysOffset' => 25, 'monthsAgo' => 36],
    ],

    /*
    |--------------------------------------------------------------------------
    | Subscription Domain Map
    |--------------------------------------------------------------------------
    */
    'domain_map' => [
        'Netflix' => 'netflix.com', 'Spotify' => 'spotify.com', 'Amazon' => 'amazon.com',
        'Adobe' => 'adobe.com', 'GitHub' => 'github.com', 'ChatGPT' => 'openai.com',
        'Apple' => 'apple.com', 'Google' => 'google.com', 'YouTube' => 'youtube.com',
        'Zoom' => 'zoom.us', 'Slack' => 'slack.com', 'Steam' => 'steampowered.com',
        'Airbnb' => 'airbnb.com', 'Uber' => 'uber.com', 'Inwi' => 'inwi.ma',
        'Orange' => 'orange.ma', 'Maroc Telecom' => 'iam.ma',
    ],
];

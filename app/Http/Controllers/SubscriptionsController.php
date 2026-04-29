<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionsController extends Controller
{
    public function page()
    {
        $activeSubscriptions = [
            [
                'id' => 'SUB-001',
                'name' => 'Netflix Premium',
                'domain' => 'netflix.com',
                'plan' => 'Ultra HD 4K',
                'price' => 19.99,
                'status' => 'Active',
                'billingCycle' => 'Monthly',
                'nextBilling' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'startedAt' => Carbon::now()->subMonths(18)->format('Y-m-d'),
            ],
            [
                'id' => 'SUB-002',
                'name' => 'Spotify Premium',
                'domain' => 'spotify.com',
                'plan' => 'Duo',
                'price' => 14.99,
                'status' => 'Active',
                'billingCycle' => 'Monthly',
                'nextBilling' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'startedAt' => Carbon::now()->subMonths(24)->format('Y-m-d'),
            ],
            [
                'id' => 'SUB-003',
                'name' => 'Amazon Prime',
                'domain' => 'amazon.com',
                'plan' => 'Annual Membership',
                'price' => 139.00,
                'status' => 'Active',
                'billingCycle' => 'Yearly',
                'nextBilling' => Carbon::now()->addMonths(4)->format('Y-m-d'),
                'startedAt' => Carbon::now()->subMonths(32)->format('Y-m-d'),
            ],
            [
                'id' => 'SUB-004',
                'name' => 'Adobe Creative Cloud',
                'domain' => 'adobe.com',
                'plan' => 'All Apps',
                'price' => 54.99,
                'status' => 'Active',
                'billingCycle' => 'Monthly',
                'nextBilling' => Carbon::now()->addDays(20)->format('Y-m-d'),
                'startedAt' => Carbon::now()->subMonths(8)->format('Y-m-d'),
            ],
            [
                'id' => 'SUB-005',
                'name' => 'GitHub Copilot',
                'domain' => 'github.com',
                'plan' => 'Individual',
                'price' => 10.00,
                'status' => 'Active',
                'billingCycle' => 'Monthly',
                'nextBilling' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'startedAt' => Carbon::now()->subMonths(12)->format('Y-m-d'),
            ],
            [
                'id' => 'SUB-006',
                'name' => 'ChatGPT Plus',
                'domain' => 'openai.com',
                'plan' => 'Plus',
                'price' => 20.00,
                'status' => 'Paused',
                'billingCycle' => 'Monthly',
                'nextBilling' => '-',
                'startedAt' => Carbon::now()->subMonths(6)->format('Y-m-d'),
            ]
        ];

        // Generate some billing history
        $billingHistory = [];
        $providers = [
            ['name' => 'Netflix', 'domain' => 'netflix.com', 'amount' => 19.99],
            ['name' => 'Spotify', 'domain' => 'spotify.com', 'amount' => 14.99],
            ['name' => 'Adobe', 'domain' => 'adobe.com', 'amount' => 54.99],
            ['name' => 'GitHub', 'domain' => 'github.com', 'amount' => 10.00],
        ];

        for ($i = 0; $i < 10; $i++) {
            $provider = $providers[array_rand($providers)];
            $billingHistory[] = [
                'id' => 'INV-' . rand(10000, 99999),
                'description' => $provider['name'] . ' Subscription',
                'domain' => $provider['domain'],
                'amount' => $provider['amount'],
                'status' => 'Paid',
                'date' => Carbon::now()->subDays(rand(1, 60))->format('Y-m-d'),
            ];
        }

        usort($billingHistory, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        // Calculate stats
        $activeCount = count(array_filter($activeSubscriptions, fn($s) => $s['status'] === 'Active'));
        $monthlyTotal = collect($activeSubscriptions)
            ->filter(fn($s) => $s['status'] === 'Active' && $s['billingCycle'] === 'Monthly')
            ->sum('price');
            
        $yearlyTotal = collect($activeSubscriptions)
            ->filter(fn($s) => $s['status'] === 'Active' && $s['billingCycle'] === 'Yearly')
            ->sum('price');
            
        // approximate total monthly cost
        $estimatedMonthly = $monthlyTotal + ($yearlyTotal / 12);

        return Inertia::render('subscriptions', [
            'subscriptions' => $activeSubscriptions,
            'billingHistory' => $billingHistory,
            'stats' => [
                'activeCount' => $activeCount,
                'monthlySpend' => round($estimatedMonthly, 2),
                'yearlySpend' => round($estimatedMonthly * 12, 2),
            ]
        ]);
    }
}

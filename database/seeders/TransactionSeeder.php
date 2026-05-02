<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('transactions')->truncate();

        $transactions = [];
        $startDate = Carbon::now()->subMonths(8)->startOfMonth();
        $endDate = Carbon::now();

        $merchants = [
            'Food' => [
                ['name' => 'Starbucks', 'color' => '#00704A'],
                ['name' => 'McDonalds', 'color' => '#FFC72C'],
                ['name' => 'Uber Eats', 'color' => '#06C167'],
                ['name' => 'Marjane', 'color' => '#E31E24'],
                ['name' => 'Carrefour', 'color' => '#004E9A'],
                ['name' => 'Paul Bakery', 'color' => '#D4A574'],
                ['name' => 'Pizza Hut', 'color' => '#EE3A23'],
            ],
            'Transport' => [
                ['name' => 'Uber', 'color' => '#000000'],
                ['name' => 'Shell', 'color' => '#FBCE07'],
                ['name' => 'Inwi Taxi', 'color' => '#D4AF37'],
                ['name' => 'ONCF Train', 'color' => '#1B75BC'],
            ],
            'Entertainment' => [
                ['name' => 'Netflix', 'color' => '#E50914'],
                ['name' => 'Spotify', 'color' => '#1DB954'],
                ['name' => 'PlayStation', 'color' => '#00439C'],
                ['name' => 'Steam', 'color' => '#171A21'],
            ],
            'Shopping' => [
                ['name' => 'Amazon', 'color' => '#FF9900'],
                ['name' => 'Zara', 'color' => '#000000'],
                ['name' => 'Nike', 'color' => '#F1152B'],
                ['name' => 'Jumia', 'color' => '#F68B1E'],
            ],
            'Utilities' => [
                ['name' => 'Lydec', 'color' => '#005BA5'],
                ['name' => 'Maroc Telecom', 'color' => '#ED1C24'],
                ['name' => 'Inwi', 'color' => '#D4AF37'],
                ['name' => 'Orange', 'color' => '#FF7900'],
            ],
            'Health' => [
                ['name' => 'Pharmacy Central', 'color' => '#10B981'],
                ['name' => 'Clinique Al Amal', 'color' => '#3B82F6'],
            ],
            'Transfer' => [
                ['name' => 'Wafacash', 'color' => '#FF6B00'],
                ['name' => 'BMCE Transfer', 'color' => '#003366'],
            ],
        ];

        $creditSources = [
            ['merchant' => 'Tech Corp SARL', 'category' => 'Salary', 'color' => '#1D4ED8', 'min' => 35000, 'max' => 45000],
            ['merchant' => 'Freelance Client', 'category' => 'Freelance', 'color' => '#10B981', 'min' => 5000, 'max' => 15000],
            ['merchant' => 'Investment Returns', 'category' => 'Investment', 'color' => '#D4AF37', 'min' => 2000, 'max' => 8000],
            ['merchant' => 'Refund Amazon', 'category' => 'Refund', 'color' => '#FF9900', 'min' => 200, 'max' => 1500],
        ];

        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            // Salary credit
            $txDate = $currentDate->copy()->setDay(1)->setHour(9)->setMinute(0);
            if ($txDate <= $endDate) {
                $source = $creditSources[0];
                $transactions[] = [
                    'merchant' => $source['merchant'],
                    'logo_color' => $source['color'],
                    'card_last4' => null,
                    'amount' => rand($source['min'], $source['max']),
                    'type' => 'credit',
                    'category' => $source['category'],
                    'transacted_at' => $txDate,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ];
            }

            // Occasional freelance income
            if (rand(0, 2) > 0) {
                $day = rand(10, 20);
                $txDate = $currentDate->copy()->setDay($day)->setHour(14)->setMinute(30);
                if ($txDate <= $endDate) {
                    $source = $creditSources[1];
                    $transactions[] = [
                        'merchant' => $source['merchant'],
                        'logo_color' => $source['color'],
                        'card_last4' => null,
                        'amount' => rand($source['min'], $source['max']),
                        'type' => 'credit',
                        'category' => $source['category'],
                        'transacted_at' => $txDate,
                        'created_at' => $txDate,
                        'updated_at' => $txDate,
                    ];
                }
            }

            // Rent
            $txDate = $currentDate->copy()->setDay(3)->setHour(10)->setMinute(15);
            if ($txDate <= $endDate) {
                $transactions[] = [
                    'merchant' => 'Property Management',
                    'logo_color' => '#4B5563',
                    'card_last4' => '9984',
                    'amount' => rand(8000, 12000),
                    'type' => 'debit',
                    'category' => 'Housing & Rent',
                    'transacted_at' => $txDate,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ];
            }

            // Monthly utilities
            foreach (['Lydec', 'Maroc Telecom', 'Inwi'] as $utility) {
                $day = rand(5, 15);
                $txDate = $currentDate->copy()->setDay($day)->setHour(rand(10, 16))->setMinute(rand(0, 59));
                if ($txDate <= $endDate) {
                    $categoryData = $merchants['Utilities'][array_search($utility, array_column($merchants['Utilities'], 'name'))] ?? $merchants['Utilities'][0];
                    $transactions[] = [
                        'merchant' => $categoryData['name'],
                        'logo_color' => $categoryData['color'],
                        'card_last4' => '9984',
                        'amount' => rand(150, 800),
                        'type' => 'debit',
                        'category' => 'Utilities',
                        'transacted_at' => $txDate,
                        'created_at' => $txDate,
                        'updated_at' => $txDate,
                    ];
                }
            }

            // Other expenses throughout the month
            $numExpenses = rand(18, 30);
            for ($i = 0; $i < $numExpenses; $i++) {
                $maxDays = $currentDate->isCurrentMonth() ? max(1, min($endDate->day, $currentDate->daysInMonth)) : $currentDate->daysInMonth;
                $randomDay = rand(1, $maxDays);
                $randomHour = rand(8, 22);
                $randomMinute = rand(0, 59);

                $categoryKey = array_rand($merchants);
                $merchantData = $merchants[$categoryKey][array_rand($merchants[$categoryKey])];

                $amountRanges = [
                    'Food' => [80, 500],
                    'Transport' => [30, 250],
                    'Entertainment' => [100, 600],
                    'Shopping' => [200, 3000],
                    'Utilities' => [150, 800],
                    'Health' => [200, 2000],
                    'Transfer' => [500, 5000],
                ];

                [$min, $max] = $amountRanges[$categoryKey] ?? [100, 500];

                $txDate = $currentDate->copy()->setDay($randomDay)->setHour($randomHour)->setMinute($randomMinute);

                if ($txDate > $endDate) {
                    continue;
                }

                $transactions[] = [
                    'merchant' => $merchantData['name'],
                    'logo_color' => $merchantData['color'],
                    'card_last4' => '9984',
                    'amount' => rand($min, $max),
                    'type' => 'debit',
                    'category' => $categoryKey,
                    'transacted_at' => $txDate,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ];
            }

            $currentDate->addMonth();
        }

        $chunks = array_chunk($transactions, 200);
        foreach ($chunks as $chunk) {
            DB::table('transactions')->insert($chunk);
        }
    }
}

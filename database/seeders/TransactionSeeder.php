<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = [];
        $startDate = Carbon::now()->subYears(3)->startOfMonth();
        $endDate = Carbon::now();

        $merchants = [
            'Food & Dining' => [
                ['name' => 'Starbucks', 'color' => '#00704A'],
                ['name' => 'McDonalds', 'color' => '#FFC72C'],
                ['name' => 'Uber Eats', 'color' => '#06C167'],
                ['name' => 'Local Grocery', 'color' => '#10B981'],
            ],
            'Shopping' => [
                ['name' => 'Amazon', 'color' => '#FF9900'],
                ['name' => 'Apple', 'color' => '#000000'],
                ['name' => 'Zara', 'color' => '#000000'],
                ['name' => 'Nike', 'color' => '#F1152B'],
            ],
            'Entertainment' => [
                ['name' => 'Netflix', 'color' => '#E50914'],
                ['name' => 'Spotify', 'color' => '#1DB954'],
                ['name' => 'PlayStation', 'color' => '#00439C'],
                ['name' => 'Steam', 'color' => '#171A21'],
            ],
            'Transportation' => [
                ['name' => 'Uber', 'color' => '#000000'],
                ['name' => 'Shell', 'color' => '#FBCE07'],
                ['name' => 'Public Transit', 'color' => '#3B82F6'],
            ],
            'Utilities' => [
                ['name' => 'Electric Co', 'color' => '#F59E0B'],
                ['name' => 'Water Co', 'color' => '#3B82F6'],
                ['name' => 'Internet Provider', 'color' => '#8B5CF6'],
            ]
        ];

        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            // Salary
            $txDate = $currentDate->copy()->setDay(1)->setHour(9)->setMinute(0);
            if ($txDate <= $endDate) {
                $transactions[] = [
                    'merchant' => 'Tech Corp Inc.',
                    'logo_color' => '#1D4ED8',
                    'card_last4' => null,
                    'amount' => rand(40000, 45000), // MAD 40k+
                    'type' => 'credit',
                    'category' => 'Salary',
                    'transacted_at' => $txDate,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ];
            }

            // Rent
            $txDate = $currentDate->copy()->setDay(2)->setHour(10)->setMinute(15);
            if ($txDate <= $endDate) {
                $transactions[] = [
                    'merchant' => 'Property Management',
                    'logo_color' => '#4B5563',
                    'card_last4' => '0224',
                    'amount' => -rand(12000, 15000), // MAD 12k+
                    'type' => 'debit',
                    'category' => 'Housing & Rent',
                    'transacted_at' => $txDate,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ];
            }

            // Other expenses throughout the month
            $numExpenses = rand(15, 25);
            for ($i = 0; $i < $numExpenses; $i++) {
                $maxDays = $currentDate->isCurrentMonth() ? max(1, min($endDate->day, $currentDate->daysInMonth)) : $currentDate->daysInMonth;
                $randomDay = rand(1, $maxDays);
                $randomHour = rand(8, 22);
                $randomMinute = rand(0, 59);

                $categoryKey = array_rand($merchants);
                $merchantData = $merchants[$categoryKey][array_rand($merchants[$categoryKey])];

                $amount = 0;
                switch ($categoryKey) {
                    case 'Food & Dining': $amount = -rand(50, 400); break;
                    case 'Shopping': $amount = -rand(200, 2000); break;
                    case 'Entertainment': $amount = -rand(100, 600); break;
                    case 'Transportation': $amount = -rand(30, 200); break;
                    case 'Utilities': $amount = -rand(300, 1000); break;
                }

                $txDate = $currentDate->copy()->setDay($randomDay)->setHour($randomHour)->setMinute($randomMinute);

                if ($txDate > $endDate) {
                    continue;
                }

                $transactions[] = [
                    'merchant' => $merchantData['name'],
                    'logo_color' => $merchantData['color'],
                    'card_last4' => '0224',
                    'amount' => $amount,
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

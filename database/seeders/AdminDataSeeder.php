<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminDataSeeder extends Seeder
{
    private User $user;
    private Carbon $now;
    private string $cardLast4;

    public function run(): void
    {
        $this->user = User::where('is_admin', true)->first();
        if (!$this->user) {
            $this->command->warn('No admin user found, skipping AdminDataSeeder.');
            return;
        }

        $this->now = Carbon::now();
        $this->cardLast4 = config('oscorp.card.last4', '9984');

        DB::table('transactions')->where('user_id', $this->user->id)->delete();
        DB::table('goals')->where('user_id', $this->user->id)->delete();
        DB::table('loans')->where('user_id', $this->user->id)->delete();

        $this->seedGoals();
        $this->seedLoans();
        $this->seedTransactions();

        $this->command->info('Admin seeded: 2 goals, 3 loans, transactions.');
    }

    private function seedGoals(): void
    {
        $goals = [
            [
                'user_id'         => $this->user->id,
                'name'            => 'Luxury Villa Fund',
                'icon'            => 'Home',
                'target_amount'   => 2000000,
                'target_months'   => 24,
                'monthly_savings' => 85000,
                'current_savings' => 425000,
                'start_date'      => $this->now->copy()->subMonths(5),
                'target_date'     => $this->now->copy()->addMonths(19),
                'status'          => 'active',
                'is_automatic'    => true,
                'created_at'      => $this->now->copy()->subMonths(5),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'name'            => 'Fleet Investment',
                'icon'            => 'Car',
                'target_amount'   => 500000,
                'target_months'   => 18,
                'monthly_savings' => 28000,
                'current_savings' => 140000,
                'start_date'      => $this->now->copy()->subMonths(5),
                'target_date'     => $this->now->copy()->addMonths(13),
                'status'          => 'active',
                'is_automatic'    => true,
                'created_at'      => $this->now->copy()->subMonths(5),
                'updated_at'      => $this->now,
            ],
        ];

        DB::table('goals')->insert($goals);
    }

    private function seedLoans(): void
    {
        $loanRows = [
            [
                'user_id'         => $this->user->id,
                'type'            => 'Personal Loan',
                'amount'          => 120000,
                'rate'            => 6.0,
                'term_months'     => 24,
                'monthly_payment' => 5317.50,
                'total_repayment' => 127620.00,
                'paid_amount'     => 79762.50,
                'purpose'         => 'Investment portfolio expansion',
                'admin_notes'     => null,
                'status'          => 'active',
                'approved_at'     => $this->now->copy()->subMonths(15),
                'rejected_at'     => null,
                'approved_by'     => $this->user->id,
                'created_at'      => $this->now->copy()->subMonths(15),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'type'            => 'Real Estate Loan',
                'amount'          => 500000,
                'rate'            => 5.2,
                'term_months'     => 60,
                'monthly_payment' => 9483.33,
                'total_repayment' => 569000.00,
                'paid_amount'     => 569000.00,
                'purpose'         => 'Commercial property acquisition',
                'admin_notes'     => null,
                'status'          => 'completed',
                'approved_at'     => $this->now->copy()->subMonths(72),
                'rejected_at'     => null,
                'approved_by'     => $this->user->id,
                'created_at'      => $this->now->copy()->subMonths(72),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'type'            => 'Business Credit Line',
                'amount'          => 300000,
                'rate'            => 7.8,
                'term_months'     => 36,
                'monthly_payment' => 9366.67,
                'total_repayment' => 337200.00,
                'paid_amount'     => 0,
                'purpose'         => 'Working capital for subsidiary',
                'admin_notes'     => null,
                'status'          => 'pending',
                'approved_at'     => null,
                'rejected_at'     => null,
                'approved_by'     => null,
                'created_at'      => $this->now->copy()->subDays(3),
                'updated_at'      => $this->now->copy()->subDays(3),
            ],
        ];

        DB::table('loans')->insert($loanRows);
    }

    private function tx(array $data): array
    {
        return array_merge([
            'user_id'       => $this->user->id,
            'card_last4'    => null,
            'logo_color'    => null,
            'source'        => null,
            'note'          => null,
            'status'        => 'completed',
        ], $data);
    }

    private function seedTransactions(): void
    {
        $transactions = [];
        $startDate = $this->now->copy()->subMonths(12)->startOfMonth();

        $merchants = [
            'Food & Dining' => [
                ['merchant' => 'Le Louis Restaurant', 'color' => '#D4AF37', 'min' => 300, 'max' => 1200],
                ['merchant' => 'Café de Paris', 'color' => '#8B4513', 'min' => 80, 'max' => 250],
                ['merchant' => 'Marjane Gourmet', 'color' => '#E31E24', 'min' => 400, 'max' => 1500],
                ['merchant' => 'Sushi Palace', 'color' => '#FF6347', 'min' => 200, 'max' => 800],
            ],
            'Transport' => [
                ['merchant' => 'Uber Business', 'color' => '#000000', 'min' => 50, 'max' => 300],
                ['merchant' => 'TotalEnergies', 'color' => '#FFD700', 'min' => 500, 'max' => 1000],
                ['merchant' => 'Royal Air Maroc', 'color' => '#004C9E', 'min' => 2000, 'max' => 8000],
            ],
            'Shopping' => [
                ['merchant' => 'Amazon Business', 'color' => '#FF9900', 'min' => 500, 'max' => 5000],
                ['merchant' => 'Apple Store', 'color' => '#A2AAAD', 'min' => 2000, 'max' => 15000],
                ['merchant' => 'Louis Vuitton', 'color' => '#B8860B', 'min' => 5000, 'max' => 25000],
            ],
            'Utilities' => [
                ['merchant' => 'Lydec Pro', 'color' => '#005BA5', 'min' => 500, 'max' => 1500],
                ['merchant' => 'Maroc Telecom', 'color' => '#ED1C24', 'min' => 300, 'max' => 800],
            ],
            'Health' => [
                ['merchant' => 'Clinique Agdal', 'color' => '#10B981', 'min' => 500, 'max' => 3000],
                ['merchant' => 'Pharmacie Elite', 'color' => '#3B82F6', 'min' => 100, 'max' => 600],
            ],
            'Travel' => [
                ['merchant' => 'Four Seasons Casablanca', 'color' => '#B8860B', 'min' => 3000, 'max' => 12000],
                ['merchant' => 'Emirates Airlines', 'color' => '#D71921', 'min' => 5000, 'max' => 20000],
            ],
        ];

        $creditSources = [
            ['merchant' => 'OSCORP Holdings', 'category' => 'Salary', 'color' => '#D4AF37', 'min' => 85000, 'max' => 120000, 'day' => 28],
            ['merchant' => 'Dividend Payment', 'category' => 'Investment', 'color' => '#10B981', 'min' => 15000, 'max' => 40000],
            ['merchant' => 'Asset Liquidation', 'category' => 'Investment', 'color' => '#6366F1', 'min' => 50000, 'max' => 150000],
        ];

        $currentDate = $startDate->copy();

        while ($currentDate <= $this->now) {
            // Salary credit on the 28th
            $txDate = $currentDate->copy()->setDay(28)->setHour(8)->setMinute(0);
            if ($txDate <= $this->now) {
                $source = $creditSources[0];
                $transactions[] = $this->tx([
                    'merchant'      => $source['merchant'],
                    'logo_color'    => $source['color'],
                    'amount'        => rand($source['min'], $source['max']),
                    'type'          => 'credit',
                    'category'      => $source['category'],
                    'source'        => 'wire',
                    'note'          => 'Executive compensation - ' . $currentDate->format('F Y'),
                    'transacted_at' => $txDate,
                    'created_at'    => $txDate,
                    'updated_at'    => $txDate,
                ]);
            }

            // Dividend income (~50% of months)
            if (rand(0, 1) === 0) {
                $source = $creditSources[1];
                $txDate = $currentDate->copy()->setDay(rand(5, 15))->setHour(10)->setMinute(rand(0, 59));
                if ($txDate <= $this->now) {
                    $transactions[] = $this->tx([
                        'merchant'      => $source['merchant'],
                        'logo_color'    => $source['color'],
                        'amount'        => rand($source['min'], $source['max']),
                        'type'          => 'credit',
                        'category'      => $source['category'],
                        'source'        => 'wire',
                        'transacted_at' => $txDate,
                        'created_at'    => $txDate,
                        'updated_at'    => $txDate,
                    ]);
                }
            }

            // Monthly subscriptions
            $subscriptions = [
                ['merchant' => 'Netflix Premium', 'color' => '#E50914', 'amount' => 120, 'category' => 'Entertainment', 'day' => 12],
                ['merchant' => 'Spotify Premium', 'color' => '#1DB954', 'amount' => 85, 'category' => 'Entertainment', 'day' => 5],
            ];
            foreach ($subscriptions as $sub) {
                $txDate = $currentDate->copy()->setDay($sub['day'])->setHour(9)->setMinute(rand(0, 59));
                if ($txDate <= $this->now) {
                    $transactions[] = $this->tx([
                        'merchant'      => $sub['merchant'],
                        'logo_color'    => $sub['color'],
                        'card_last4'    => $this->cardLast4,
                        'amount'        => $sub['amount'],
                        'type'          => 'debit',
                        'category'      => $sub['category'],
                        'source'        => 'card',
                        'note'          => 'Monthly subscription',
                        'transacted_at' => $txDate,
                        'created_at'    => $txDate,
                        'updated_at'    => $txDate,
                    ]);
                }
            }

            // Random expenses (8-15 per month)
            $numExpenses = rand(8, 15);
            for ($i = 0; $i < $numExpenses; $i++) {
                $maxDay = $currentDate->isCurrentMonth()
                    ? max(1, min($this->now->day, $currentDate->daysInMonth))
                    : $currentDate->daysInMonth;

                $randomDay = rand(1, max(1, $maxDay));
                $randomHour = rand(8, 22);
                $randomMinute = rand(0, 59);

                $categoryKey = array_rand($merchants);
                $merchantData = $merchants[$categoryKey][array_rand($merchants[$categoryKey])];

                $txDate = $currentDate->copy()->setDay($randomDay)->setHour($randomHour)->setMinute($randomMinute);

                if ($txDate > $this->now) continue;

                $transactions[] = $this->tx([
                    'merchant'      => $merchantData['merchant'],
                    'logo_color'    => $merchantData['color'],
                    'card_last4'    => $this->cardLast4,
                    'amount'        => rand($merchantData['min'], $merchantData['max']),
                    'type'          => 'debit',
                    'category'      => $categoryKey,
                    'transacted_at' => $txDate,
                    'created_at'    => $txDate,
                    'updated_at'    => $txDate,
                ]);
            }

            $currentDate->addMonth();
        }

        foreach (array_chunk($transactions, 200) as $chunk) {
            DB::table('transactions')->insert($chunk);
        }
    }
}

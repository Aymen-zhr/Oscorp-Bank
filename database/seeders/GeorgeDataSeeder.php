<?php

namespace Database\Seeders;

use App\Models\Goal;
use App\Models\Loan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeorgeDataSeeder extends Seeder
{
    private User $user;
    private Carbon $now;
    private string $cardLast4;

    public function run(): void
    {
        $this->user = User::where('is_admin', false)->first();
        if (!$this->user) {
            $this->user = User::factory()->create([
                'name'              => env('SEEDER_USER_NAME', 'George'),
                'email'             => env('SEEDER_USER_EMAIL', 'george@oscorp.com'),
                'password'          => bcrypt(env('SEEDER_USER_PASSWORD', 'password')),
                'tag'               => '@george',
                'email_verified_at' => now(),
                'phone'             => '+212 6 98 76 54 32',
                'job_title'         => 'Software Engineer',
                'address'           => '12 Rue des Orangers, Casablanca',
                'cin'               => 'CD987654',
                'date_of_birth'     => '1992-08-14',
                'place_of_birth'    => 'Marrakech',
                'nationality'       => 'Moroccan',
                'gender'            => 'male',
                'created_at'        => now()->subYears(3),
                'updated_at'        => now()->subYears(3),
            ]);
        }

        $this->now = Carbon::now();
        $this->cardLast4 = config('oscorp.card.last4', '9984');

        DB::table('transactions')->where('user_id', $this->user->id)->delete();
        DB::table('goals')->where('user_id', $this->user->id)->delete();
        DB::table('loans')->where('user_id', $this->user->id)->delete();

        $this->seedGoals();
        $this->seedLoans();
        $this->seedTransactions();

        $this->command->info('George seeded: 3 goals, 4 loans, transactions.');
    }

    private function seedGoals(): void
    {
        $goals = [
            [
                'user_id'         => $this->user->id,
                'name'            => 'Emergency Fund',
                'icon'            => 'Shield',
                'target_amount'   => 50000,
                'target_months'   => 20,
                'monthly_savings' => 2500,
                'current_savings' => 22500,
                'start_date'      => $this->now->copy()->subMonths(9),
                'target_date'     => $this->now->copy()->addMonths(11),
                'status'          => 'active',
                'is_automatic'    => true,
                'created_at'      => $this->now->copy()->subMonths(9),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'name'            => 'New Car',
                'icon'            => 'Car',
                'target_amount'   => 250000,
                'target_months'   => 36,
                'monthly_savings' => 7000,
                'current_savings' => 87500,
                'start_date'      => $this->now->copy()->subMonths(13),
                'target_date'     => $this->now->copy()->addMonths(23),
                'status'          => 'active',
                'is_automatic'    => true,
                'created_at'      => $this->now->copy()->subMonths(13),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'name'            => 'Dream Vacation',
                'icon'            => 'Plane',
                'target_amount'   => 80000,
                'target_months'   => 12,
                'monthly_savings' => 6700,
                'current_savings' => 40000,
                'start_date'      => $this->now->copy()->subMonths(6),
                'target_date'     => $this->now->copy()->addMonths(6),
                'status'          => 'active',
                'is_automatic'    => true,
                'created_at'      => $this->now->copy()->subMonths(6),
                'updated_at'      => $this->now,
            ],
        ];

        DB::table('goals')->insert($goals);
    }

    private function seedLoans(): void
    {
        $admin = User::where('is_admin', true)->first();
        $adminId = $admin?->id ?? 1;

        $loanRows = [
            [
                'user_id'         => $this->user->id,
                'type'            => 'Personal Loan',
                'amount'          => 80000,
                'rate'            => 7.5,
                'term_months'     => 36,
                'monthly_payment' => 2488.89,
                'total_repayment' => 89600.00,
                'paid_amount'     => 49777.80,
                'purpose'         => 'Home renovation',
                'admin_notes'     => null,
                'status'          => 'active',
                'approved_at'     => $this->now->copy()->subMonths(20),
                'rejected_at'     => null,
                'approved_by'     => $adminId,
                'created_at'      => $this->now->copy()->subMonths(20),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'type'            => 'Car Loan',
                'amount'          => 150000,
                'rate'            => 6.5,
                'term_months'     => 48,
                'monthly_payment' => 3556.25,
                'total_repayment' => 170700.00,
                'paid_amount'     => 170700.00,
                'purpose'         => 'Purchase Toyota Corolla',
                'admin_notes'     => null,
                'status'          => 'completed',
                'approved_at'     => $this->now->copy()->subMonths(50),
                'rejected_at'     => null,
                'approved_by'     => $adminId,
                'created_at'      => $this->now->copy()->subMonths(50),
                'updated_at'      => $this->now,
            ],
            [
                'user_id'         => $this->user->id,
                'type'            => 'Education Loan',
                'amount'          => 50000,
                'rate'            => 5.0,
                'term_months'     => 24,
                'monthly_payment' => 2193.75,
                'total_repayment' => 52650.00,
                'paid_amount'     => 0,
                'purpose'         => 'Professional certification course',
                'admin_notes'     => null,
                'status'          => 'pending',
                'approved_at'     => null,
                'rejected_at'     => null,
                'approved_by'     => null,
                'created_at'      => $this->now->copy()->subDays(5),
                'updated_at'      => $this->now->copy()->subDays(5),
            ],
            [
                'user_id'         => $this->user->id,
                'type'            => 'Business Loan',
                'amount'          => 200000,
                'rate'            => 9.0,
                'term_months'     => 60,
                'monthly_payment' => 4152.78,
                'total_repayment' => 249166.80,
                'paid_amount'     => 0,
                'purpose'         => 'Startup funding for e-commerce platform',
                'admin_notes'     => 'Insufficient collateral and business plan',
                'status'          => 'rejected',
                'approved_at'     => null,
                'rejected_at'     => $this->now->copy()->subMonths(1),
                'approved_by'     => $adminId,
                'created_at'      => $this->now->copy()->subMonths(2),
                'updated_at'      => $this->now->copy()->subMonths(1),
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
                ['merchant' => 'Starbucks', 'color' => '#00704A', 'min' => 45, 'max' => 120],
                ['merchant' => 'McDonald\'s', 'color' => '#FFC72C', 'min' => 55, 'max' => 150],
                ['merchant' => 'Uber Eats', 'color' => '#06C167', 'min' => 80, 'max' => 250],
                ['merchant' => 'Marjane Market', 'color' => '#E31E24', 'min' => 200, 'max' => 800],
                ['merchant' => 'Carrefour', 'color' => '#004E9A', 'min' => 150, 'max' => 600],
                ['merchant' => 'La Sqala', 'color' => '#D4A574', 'min' => 180, 'max' => 400],
                ['merchant' => 'Paul Bakery', 'color' => '#D4A574', 'min' => 60, 'max' => 180],
            ],
            'Transport' => [
                ['merchant' => 'Uber', 'color' => '#000000', 'min' => 25, 'max' => 120],
                ['merchant' => 'Shell Station', 'color' => '#FBCE07', 'min' => 300, 'max' => 600],
                ['merchant' => 'Inwi Taxi', 'color' => '#D4AF37', 'min' => 20, 'max' => 80],
                ['merchant' => 'ONCF Train', 'color' => '#1B75BC', 'min' => 120, 'max' => 350],
            ],
            'Shopping' => [
                ['merchant' => 'Amazon', 'color' => '#FF9900', 'min' => 150, 'max' => 2000],
                ['merchant' => 'Zara', 'color' => '#000000', 'min' => 300, 'max' => 1500],
                ['merchant' => 'Nike Store', 'color' => '#F1152B', 'min' => 400, 'max' => 2000],
                ['merchant' => 'Jumia', 'color' => '#F68B1E', 'min' => 100, 'max' => 1000],
                ['merchant' => 'Fnac', 'color' => '#E11D2E', 'min' => 500, 'max' => 3000],
            ],
            'Utilities' => [
                ['merchant' => 'Lydec', 'color' => '#005BA5', 'min' => 250, 'max' => 500],
                ['merchant' => 'Maroc Telecom', 'color' => '#ED1C24', 'min' => 200, 'max' => 400],
                ['merchant' => 'Orange', 'color' => '#FF7900', 'min' => 150, 'max' => 300],
            ],
            'Health' => [
                ['merchant' => 'Pharmacie Centrale', 'color' => '#10B981', 'min' => 60, 'max' => 300],
                ['merchant' => 'Clinique Al Amal', 'color' => '#3B82F6', 'min' => 300, 'max' => 2000],
            ],
            'Entertainment' => [
                ['merchant' => 'Cinema Imax', 'color' => '#8B5CF6', 'min' => 80, 'max' => 200],
                ['merchant' => 'Steam Games', 'color' => '#171A21', 'min' => 100, 'max' => 800],
                ['merchant' => 'PlayStation Store', 'color' => '#00439C', 'min' => 150, 'max' => 700],
            ],
        ];

        $subscriptionDefs = [
            ['merchant' => 'Netflix Premium', 'color' => '#E50914', 'amount' => 120, 'category' => 'Entertainment', 'day' => 12],
            ['merchant' => 'Spotify Premium', 'color' => '#1DB954', 'amount' => 85, 'category' => 'Entertainment', 'day' => 5],
            ['merchant' => 'Adobe Creative Cloud', 'color' => '#FF0000', 'amount' => 550, 'category' => 'Software', 'day' => 20],
            ['merchant' => 'GitHub Copilot', 'color' => '#4078C0', 'amount' => 100, 'category' => 'Software', 'day' => 2],
            ['merchant' => 'Inwi Mobile', 'color' => '#E30613', 'amount' => 200, 'category' => 'Utilities', 'day' => 25],
        ];

        $creditSources = [
            ['merchant' => 'Oscorp Salary', 'category' => 'Salary', 'color' => '#D4AF37', 'min' => 45000, 'max' => 50000, 'day' => 28],
            ['merchant' => 'Freelance Web Dev', 'category' => 'Freelance', 'color' => '#10B981', 'min' => 5000, 'max' => 20000],
            ['merchant' => 'Investment Returns', 'category' => 'Investment', 'color' => '#6366F1', 'min' => 1500, 'max' => 6000],
            ['merchant' => 'Dividend Payment', 'category' => 'Investment', 'color' => '#8B5CF6', 'min' => 800, 'max' => 2500],
        ];

        $specialExpenses = [
            ['merchant' => 'Airbnb Marrakech', 'color' => '#FF5A5F', 'amount' => 4500, 'category' => 'Travel'],
            ['merchant' => 'Royal Air Maroc', 'color' => '#004C9E', 'amount' => 3800, 'category' => 'Travel'],
            ['merchant' => 'Electroplanet TV', 'color' => '#003580', 'amount' => 6500, 'category' => 'Shopping'],
            ['merchant' => 'IKEA Casablanca', 'color' => '#0051BA', 'amount' => 4200, 'category' => 'Shopping'],
            ['merchant' => 'Gym Fitness Plus', 'color' => '#22C55E', 'amount' => 350, 'category' => 'Health'],
        ];

        $currentDate = $startDate->copy();

        while ($currentDate <= $this->now) {
            $monthKey = $currentDate->format('Y-m');

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
                    'note'          => 'Monthly salary - ' . $currentDate->format('F Y'),
                    'transacted_at' => $txDate,
                    'created_at'    => $txDate,
                    'updated_at'    => $txDate,
                ]);
            }

            // Freelance income (occasional, ~60% of months)
            if (rand(0, 4) > 1) {
                $source = $creditSources[1];
                $txDate = $currentDate->copy()->setDay(rand(10, 22))->setHour(14)->setMinute(rand(0, 59));
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

            // Investment returns (~30% of months)
            if (rand(0, 6) > 3) {
                $source = $creditSources[array_rand([2 => $creditSources[2], 3 => $creditSources[3]])];
                $txDate = $currentDate->copy()->setDay(rand(1, 10))->setHour(10)->setMinute(rand(0, 59));
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

            // Rent debit on the 3rd
            $txDate = $currentDate->copy()->setDay(3)->setHour(10)->setMinute(15);
            if ($txDate <= $this->now) {
                $transactions[] = $this->tx([
                    'merchant'      => 'Property Management',
                    'logo_color'    => '#4B5563',
                    'card_last4'    => $this->cardLast4,
                    'amount'        => rand(9000, 12000),
                    'type'          => 'debit',
                    'category'      => 'Housing & Rent',
                    'transacted_at' => $txDate,
                    'created_at'    => $txDate,
                    'updated_at'    => $txDate,
                ]);
            }

            // Monthly utilities (2-3 per month)
            $numUtilities = rand(2, 3);
            $utilityMerchants = $merchants['Utilities'];
            $usedUtilities = [];
            for ($u = 0; $u < $numUtilities; $u++) {
                $util = $utilityMerchants[array_rand($utilityMerchants)];
                if (in_array($util['merchant'], $usedUtilities)) continue;
                $usedUtilities[] = $util['merchant'];
                $txDate = $currentDate->copy()->setDay(rand(5, 15))->setHour(rand(9, 17))->setMinute(rand(0, 59));
                if ($txDate <= $this->now) {
                    $transactions[] = $this->tx([
                        'merchant'      => $util['merchant'],
                        'logo_color'    => $util['color'],
                        'card_last4'    => $this->cardLast4,
                        'amount'        => rand($util['min'], $util['max']),
                        'type'          => 'debit',
                        'category'      => 'Utilities',
                        'transacted_at' => $txDate,
                        'created_at'    => $txDate,
                        'updated_at'    => $txDate,
                    ]);
                }
            }

            // Recurring subscriptions
            foreach ($subscriptionDefs as $sub) {
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

            // Annual Amazon Prime (only in March)
            if ($currentDate->format('m') === '03') {
                $txDate = $currentDate->copy()->setDay(15)->setHour(10)->setMinute(0);
                if ($txDate <= $this->now) {
                    $transactions[] = $this->tx([
                        'merchant'      => 'Amazon Prime',
                        'logo_color'    => '#FF9900',
                        'card_last4'    => $this->cardLast4,
                        'amount'        => 1400,
                        'type'          => 'debit',
                        'category'      => 'Shopping',
                        'source'        => 'card',
                        'note'          => 'Annual subscription',
                        'transacted_at' => $txDate,
                        'created_at'    => $txDate,
                        'updated_at'    => $txDate,
                    ]);
                }
            }

            // Random daily expenses (12-22 per month)
            $numExpenses = rand(12, 22);
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

            // Special expenses (~1 every 2 months)
            if (rand(0, 1) === 0) {
                $special = $specialExpenses[array_rand($specialExpenses)];
                $txDate = $currentDate->copy()->setDay(rand(10, 25))->setHour(rand(12, 18))->setMinute(rand(0, 59));
                if ($txDate <= $this->now) {
                    $transactions[] = $this->tx([
                        'merchant'      => $special['merchant'],
                        'logo_color'    => $special['color'],
                        'card_last4'    => $this->cardLast4,
                        'amount'        => $special['amount'],
                        'type'          => 'debit',
                        'category'      => $special['category'],
                        'transacted_at' => $txDate,
                        'created_at'    => $txDate,
                        'updated_at'    => $txDate,
                    ]);
                }
            }

            $currentDate->addMonth();
        }

        foreach (array_chunk($transactions, 200) as $chunk) {
            DB::table('transactions')->insert($chunk);
        }
    }
}

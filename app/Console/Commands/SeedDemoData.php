<?php

namespace App\Console\Commands;

use App\Models\Contact;
use App\Models\Goal;
use App\Models\Loan;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SeedDemoData extends Command
{
    protected $signature = 'demo:seed {--force : Skip confirmation}';
    protected $description = 'Seed demo accounts with fake data';

    public function handle(): int
    {
        if (!$this->option('force') && !$this->confirm('This will create/overwrite demo accounts. Continue?')) {
            $this->seedAdmin();
            $this->seedUser();
            $this->info('Done!');
            $this->info('Admin: admin@oscorp.ma / password123');
            $this->info(            'User: aymen@email.com / password123');
            return 0;
        }
        return 1;
    }

    private function seedAdmin(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@oscorp.ma'],
            [
                'name' => 'Admin Oscorp',
                'password' => bcrypt('password123'),
                'tag' => '@admin',
                'email_verified_at' => now(),
                'is_admin' => true,
                'phone' => '+212 6 00 00 00 00',
                'job_title' => 'System Administrator',
                'address' => '123 Administration St, Casablanca',
                'cin' => 'AA123456',
                'date_of_birth' => '1990-01-15',
                'place_of_birth' => 'Rabat',
                'nationality' => 'Moroccan',
                'gender' => 'male',
            ]
        );
        $this->info('Admin account created.');
    }

    private function seedUser(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'aymen@email.com'],
            [
                'name' => 'Aymen',
                'password' => bcrypt('password123'),
                'tag' => '@aymen',
                'email_verified_at' => now(),
                'is_admin' => false,
                'phone' => '+212 6 12 34 56 78',
                'job_title' => 'Software Developer',
                'address' => '45 Avenue Hassan II, Appt 8, Casablanca',
                'cin' => 'AB654321',
                'date_of_birth' => '1995-06-22',
                'place_of_birth' => 'Casablanca',
                'nationality' => 'Moroccan',
                'gender' => 'male',
            ]
        );

        DB::table('transactions')->where('user_id', $user->id)->delete();
        DB::table('goals')->where('user_id', $user->id)->delete();
        DB::table('loans')->where('user_id', $user->id)->delete();
        DB::table('contacts')->where('user_id', $user->id)->delete();

        $this->seedTransactions($user);
        $this->seedGoals($user);
        $this->seedLoan($user);
        $this->seedContacts($user);

        $this->info('User Aymen created with 5 years of data.');
    }

    private function seedTransactions(User $user): void
    {
        $now = Carbon::now();
        $start = Carbon::now()->subYears(5);
        $merchants = [
            ['merchant' => 'Carrefour Market', 'category' => 'Groceries', 'amount_range' => [150, 600], 'color' => '#22C55E'],
            ['merchant' => 'Maroc Telecom', 'category' => 'Utilities', 'amount_range' => [250, 350], 'color' => '#3B82F6'],
            ['merchant' => 'Lydec', 'category' => 'Utilities', 'amount_range' => [180, 300], 'color' => '#F59E0B'],
            ['merchant' => 'Afriquia Station', 'category' => 'Transport', 'amount_range' => [300, 500], 'color' => '#EF4444'],
            ['merchant' => 'Restaurant Al Fassia', 'category' => 'Dining', 'amount_range' => [80, 200], 'color' => '#EC4899'],
            ['merchant' => 'McDonald\'s', 'category' => 'Dining', 'amount_range' => [45, 120], 'color' => '#F59E0B'],
            ['merchant' => 'Uber', 'category' => 'Transport', 'amount_range' => [15, 60], 'color' => '#10B981'],
            ['merchant' => 'Zara', 'category' => 'Shopping', 'amount_range' => [200, 800], 'color' => '#6366F1'],
            ['merchant' => 'Pharmacie', 'category' => 'Health', 'amount_range' => [30, 150], 'color' => '#06B6D4'],
            ['merchant' => 'Orange Cash', 'category' => 'Transfer', 'amount_range' => [100, 300], 'color' => '#FF6B35'],
        ];

        $subscriptions = [
            ['merchant' => 'Netflix Premium', 'category' => 'Entertainment', 'amount' => 120, 'color' => '#E50914'],
            ['merchant' => 'Spotify Premium', 'category' => 'Entertainment', 'amount' => 85, 'color' => '#1DB954'],
            ['merchant' => 'Amazon Prime', 'category' => 'Shopping', 'amount' => 1400, 'color' => '#FF9900'],
            ['merchant' => 'Adobe Creative Cloud', 'category' => 'Software', 'amount' => 550, 'color' => '#FF0000'],
            ['merchant' => 'GitHub Copilot', 'category' => 'Software', 'amount' => 100, 'color' => '#4078C0'],
            ['merchant' => 'Inwi Mobile', 'category' => 'Utilities', 'amount' => 200, 'color' => '#E30613'],
        ];

        $special = [
            ['merchant' => 'Airbnb - Paris Trip', 'category' => 'Travel', 'amount' => 4200, 'color' => '#FF5A5F'],
            ['merchant' => 'Royal Air Maroc', 'category' => 'Travel', 'amount' => 3800, 'color' => '#004C9E'],
            ['merchant' => 'Marjane Hypermarket', 'category' => 'Groceries', 'amount' => 1200, 'color' => '#E3000F'],
            ['merchant' => 'Fnac Casablanca', 'category' => 'Shopping', 'amount' => 2500, 'color' => '#E11D2E'],
            ['merchant' => 'Electroplanet', 'category' => 'Shopping', 'amount' => 3800, 'color' => '#003580'],
            ['merchant' => 'Salam Aide Fitr', 'category' => 'Gifts', 'amount' => 2000, 'color' => '#D4AF37'],
        ];

        $transactions = [];
        $current = $start->copy();
        $payday = (int) $start->format('d');

        while ($current <= $now) {
            if ($current->format('d') == 28 || ($current->diffInDays($start) < 3 && $current->format('d') >= 28)) {
                $transactions[] = [
                    'user_id' => $user->id,
                    'merchant' => 'OSCORP SALARY',
                    'logo_color' => '#D4AF37',
                    'card_last4' => '9984',
                    'amount' => 3000.00,
                    'type' => 'credit',
                    'category' => 'Salary',
                    'source' => 'wire',
                    'note' => 'Monthly salary - ' . $current->format('F Y'),
                    'status' => 'completed',
                    'transacted_at' => $current->copy()->setDay(min(28, $current->daysInMonth))->setTime(8, 0),
                    'created_at' => $current->copy()->setDay(min(28, $current->daysInMonth)),
                    'updated_at' => $current->copy()->setDay(min(28, $current->daysInMonth)),
                ];
            }

            if ($current->format('d') == 5 || $current->format('d') == 20) {
                foreach ($subscriptions as $sub) {
                    if ($sub['merchant'] === 'Amazon Prime' && $current->format('m') !== '3') continue;
                    if ($current->diffInMonths($start) > 12 && $sub['merchant'] === 'Adobe Creative Cloud') {
                        $transactions[] = [
                            'user_id' => $user->id,
                            'merchant' => $sub['merchant'],
                            'logo_color' => $sub['color'],
                            'card_last4' => '9984',
                            'amount' => $sub['amount'],
                            'type' => 'debit',
                            'category' => $sub['category'],
                            'source' => 'card',
                            'note' => 'Monthly subscription',
                            'status' => 'completed',
                            'transacted_at' => $current->copy()->setDay(5)->setTime(10, 0),
                            'created_at' => $current->copy()->setDay(5),
                            'updated_at' => $current->copy()->setDay(5),
                        ];
                    }
                }
            }

            $weeklyDay = $current->format('d');
            if (in_array($weeklyDay % 7, [2, 5])) {
                $merchant = $merchants[array_rand($merchants)];
                $amount = round(mt_rand($merchant['amount_range'][0] * 100, $merchant['amount_range'][1] * 100) / 100, 2);
                $transactions[] = [
                    'user_id' => $user->id,
                    'merchant' => $merchant['merchant'],
                    'logo_color' => $merchant['color'],
                    'card_last4' => '9984',
                    'amount' => $amount,
                    'type' => 'debit',
                    'category' => $merchant['category'],
                    'source' => 'card',
                    'note' => null,
                    'status' => 'completed',
                    'transacted_at' => $current->copy()->setTime(mt_rand(9, 20), mt_rand(0, 59)),
                    'created_at' => $current->copy(),
                    'updated_at' => $current->copy(),
                ];
            }

            if ($current->format('d') == 15 && mt_rand(0, 2) == 0) {
                $sp = $special[array_rand($special)];
                $transactions[] = [
                    'user_id' => $user->id,
                    'merchant' => $sp['merchant'],
                    'logo_color' => $sp['color'],
                    'card_last4' => '9984',
                    'amount' => $sp['amount'],
                    'type' => 'debit',
                    'category' => $sp['category'],
                    'source' => 'card',
                    'note' => null,
                    'status' => 'completed',
                    'transacted_at' => $current->copy()->setTime(14, 30),
                    'created_at' => $current->copy(),
                    'updated_at' => $current->copy(),
                ];
            }

            $current->addDay();
        }

        foreach (array_chunk($transactions, 100) as $chunk) {
            DB::table('transactions')->insert($chunk);
        }

        $this->info('Created ' . count($transactions) . ' transactions.');
    }

    private function seedGoals(User $user): void
    {
        $goals = [
            [
                'name' => 'New MacBook Pro',
                'icon' => 'Laptop',
                'target_amount' => 25000,
                'target_months' => 10,
                'monthly_savings' => 2500,
                'current_savings' => 17500,
                'start_date' => Carbon::now()->subMonths(7),
                'target_date' => Carbon::now()->addMonths(3),
                'status' => 'active',
                'is_automatic' => true,
            ],
            [
                'name' => 'Hajj Trip Savings',
                'icon' => 'Compass',
                'target_amount' => 80000,
                'target_months' => 24,
                'monthly_savings' => 3500,
                'current_savings' => 24500,
                'start_date' => Carbon::now()->subMonths(7),
                'target_date' => Carbon::now()->addMonths(17),
                'status' => 'active',
                'is_automatic' => true,
            ],
            [
                'name' => 'Emergency Fund',
                'icon' => 'Shield',
                'target_amount' => 30000,
                'target_months' => 15,
                'monthly_savings' => 2000,
                'current_savings' => 14000,
                'start_date' => Carbon::now()->subMonths(7),
                'target_date' => Carbon::now()->addMonths(8),
                'status' => 'active',
                'is_automatic' => true,
            ],
        ];

        foreach ($goals as $goal) {
            Goal::create(array_merge($goal, ['user_id' => $user->id]));
        }

        $this->info('Created ' . count($goals) . ' savings goals.');
    }

    private function seedLoan(User $user): void
    {
        $loan = Loan::create([
            'user_id' => $user->id,
            'type' => 'Personal Loan',
            'amount' => 50000,
            'rate' => 7.5,
            'term_months' => 36,
            'monthly_payment' => 1555.00,
            'total_repayment' => 55980.00,
            'purpose' => 'Home renovation',
            'status' => 'active',
            'approved_at' => Carbon::now()->subMonths(14),
            'approved_by' => User::where('is_admin', true)->first()->id ?? 1,
        ]);

        $this->info('Created loan of 50,000 MAD.');
    }

    private function seedContacts(User $user): void
    {
        $contacts = [
            ['name' => 'Amine Bennis', 'email' => 'amine@email.com'],
            ['name' => 'Sara El Fassi', 'email' => 'sara@email.com'],
            ['name' => 'Karim Benjelloun', 'email' => 'karim@email.com'],
            ['name' => 'Nadia Tazi', 'email' => 'nadia@email.com'],
            ['name' => 'Hicham Alaoui', 'email' => 'hicham@email.com'],
        ];

        foreach ($contacts as $c) {
            $contactUser = User::firstOrCreate(
                ['email' => $c['email']],
                [
                    'name' => $c['name'],
                    'password' => bcrypt('password123'),
                    'tag' => '@' . Str::slug(explode(' ', $c['name'])[0]),
                    'email_verified_at' => now(),
                ]
            );
            Contact::create([
                'user_id' => $user->id,
                'contact_user_id' => $contactUser->id,
                'nickname' => explode(' ', $c['name'])[0],
                'status' => 'accepted',
            ]);
        }

        $this->info('Created ' . count($contacts) . ' contacts.');
    }
}

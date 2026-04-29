<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GeorgeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('transactions')->truncate();

        $now = Carbon::now();

        $transactions = [
            ['merchant' => 'Résidence Atlas',    'logo_color' => '#5B6EAE', 'card_last4' => '9984', 'amount' => 3000.00, 'type' => 'debit', 'category' => 'Rent',          'transacted_at' => '2026-04-01 08:00:00'],
            ['merchant' => 'Carrefour Casablanca','logo_color' => '#E63946', 'card_last4' => '9984', 'amount' =>  650.00, 'type' => 'debit', 'category' => 'Groceries',     'transacted_at' => '2026-04-05 11:30:00'],
            ['merchant' => 'LYDEC',               'logo_color' => '#2A9D8F', 'card_last4' => '9984', 'amount' =>  380.00, 'type' => 'debit', 'category' => 'Utilities',     'transacted_at' => '2026-04-08 09:15:00'],
            ['merchant' => 'Marjane Mall',        'logo_color' => '#F4A261', 'card_last4' => '9984', 'amount' =>  520.00, 'type' => 'debit', 'category' => 'Shopping',      'transacted_at' => '2026-04-12 14:45:00'],
            ['merchant' => 'La Sqala Restaurant', 'logo_color' => '#C77DFF', 'card_last4' => '9984', 'amount' =>  280.00, 'type' => 'debit', 'category' => 'Dining',        'transacted_at' => '2026-04-15 20:00:00'],
            ['merchant' => 'Inwi Mobile',         'logo_color' => '#E9C46A', 'card_last4' => '9984', 'amount' =>  149.00, 'type' => 'debit', 'category' => 'Telecoms',      'transacted_at' => '2026-04-18 10:00:00'],
            ['merchant' => 'Uber Maroc',          'logo_color' => '#1C1C1E', 'card_last4' => '9984', 'amount' =>  125.00, 'type' => 'debit', 'category' => 'Transport',     'transacted_at' => '2026-04-20 18:30:00'],
            ['merchant' => 'Pharmacie Centrale',  'logo_color' => '#4CC9F0', 'card_last4' => '9984', 'amount' =>  102.00, 'type' => 'debit', 'category' => 'Health',        'transacted_at' => '2026-04-21 12:00:00'],
            ['merchant' => 'Netflix Maroc',       'logo_color' => '#E50914', 'card_last4' => '9984', 'amount' =>   99.00, 'type' => 'debit', 'category' => 'Entertainment', 'transacted_at' => '2026-04-22 00:01:00'],
            ['merchant' => 'Café Américain',      'logo_color' => '#8D6E63', 'card_last4' => '9984', 'amount' =>   95.00, 'type' => 'debit', 'category' => 'Dining',        'transacted_at' => '2026-04-24 09:45:00'],
            ['merchant' => 'Hammam Royal',        'logo_color' => '#D4AF37', 'card_last4' => '9984', 'amount' =>  100.00, 'type' => 'debit', 'category' => 'Wellness',      'transacted_at' => '2026-04-25 16:00:00'],
        ];

        foreach ($transactions as $t) {
            $t['created_at'] = $now;
            $t['updated_at'] = $now;
            DB::table('transactions')->insert($t);
        }

        // --- Update George's profile to be realistic ---
        DB::table('users')->where('id', 1)->update([
            'name'              => 'George',
            'email'             => 'george@oscorp.com',
            'created_at'        => '2026-03-01 09:00:00',
            'email_verified_at' => '2026-03-01 09:05:00',
            'updated_at'        => $now,
        ]);

        $this->command->info('George seeded. Debits: 5,500 MAD. Live balance: 7,000 MAD.');
    }
}

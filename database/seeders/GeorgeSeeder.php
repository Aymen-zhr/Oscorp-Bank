<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GeorgeSeeder extends Seeder
{
    public function run(): void
    {
        $demoUser = \App\Models\User::where('is_admin', false)->first();
        $targetUserId = $demoUser?->id ?? 2;

        DB::table('transactions')->where('user_id', $targetUserId)->delete();

        $now = Carbon::now();

        $cardLast4 = config('oscorp.card.last4', '9984');
        $logoColors = config('oscorp.colors.chart_palette', ['#D4AF37', '#10B981', '#6366F1', '#F59E0B', '#EC4899']);

        $transactions = [
            ['user_id' => $targetUserId, 'merchant' => 'Résidence Atlas',    'logo_color' => $logoColors[0], 'card_last4' => $cardLast4, 'amount' => 3000.00, 'type' => 'debit', 'category' => 'Rent',          'transacted_at' => '2026-04-01 08:00:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Carrefour Casablanca','logo_color' => $logoColors[1], 'card_last4' => $cardLast4, 'amount' =>  650.00, 'type' => 'debit', 'category' => 'Groceries',     'transacted_at' => '2026-04-05 11:30:00'],
            ['user_id' => $targetUserId, 'merchant' => 'LYDEC',               'logo_color' => $logoColors[2], 'card_last4' => $cardLast4, 'amount' =>  380.00, 'type' => 'debit', 'category' => 'Utilities',     'transacted_at' => '2026-04-08 09:15:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Marjane Mall',        'logo_color' => $logoColors[3], 'card_last4' => $cardLast4, 'amount' =>  520.00, 'type' => 'debit', 'category' => 'Shopping',      'transacted_at' => '2026-04-12 14:45:00'],
            ['user_id' => $targetUserId, 'merchant' => 'La Sqala Restaurant', 'logo_color' => $logoColors[4], 'card_last4' => $cardLast4, 'amount' =>  280.00, 'type' => 'debit', 'category' => 'Dining',        'transacted_at' => '2026-04-15 20:00:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Inwi Mobile',         'logo_color' => $logoColors[0], 'card_last4' => $cardLast4, 'amount' =>  149.00, 'type' => 'debit', 'category' => 'Telecoms',      'transacted_at' => '2026-04-18 10:00:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Uber Maroc',          'logo_color' => $logoColors[1], 'card_last4' => $cardLast4, 'amount' =>  125.00, 'type' => 'debit', 'category' => 'Transport',     'transacted_at' => '2026-04-20 18:30:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Pharmacie Centrale',  'logo_color' => $logoColors[2], 'card_last4' => $cardLast4, 'amount' =>  102.00, 'type' => 'debit', 'category' => 'Health',        'transacted_at' => '2026-04-21 12:00:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Netflix Maroc',       'logo_color' => $logoColors[3], 'card_last4' => $cardLast4, 'amount' =>   99.00, 'type' => 'debit', 'category' => 'Entertainment', 'transacted_at' => '2026-04-22 00:01:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Café Américain',      'logo_color' => $logoColors[4], 'card_last4' => $cardLast4, 'amount' =>   95.00, 'type' => 'debit', 'category' => 'Dining',        'transacted_at' => '2026-04-24 09:45:00'],
            ['user_id' => $targetUserId, 'merchant' => 'Hammam Royal',        'logo_color' => $logoColors[0], 'card_last4' => $cardLast4, 'amount' =>  100.00, 'type' => 'debit', 'category' => 'Wellness',      'transacted_at' => '2026-04-25 16:00:00'],
        ];

        foreach ($transactions as $t) {
            $t['created_at'] = $now;
            $t['updated_at'] = $now;
            DB::table('transactions')->insert($t);
        }

        DB::table('users')->where('id', $targetUserId)->update([
            'name'              => env('SEEDER_USER_NAME', 'George'),
            'email'             => env('SEEDER_USER_EMAIL', 'george@oscorp.com'),
            'created_at'        => '2026-03-01 09:00:00',
            'email_verified_at' => '2026-03-01 09:05:00',
            'updated_at'        => $now,
        ]);

        $this->command->info('George seeded. Debits: 5,500 MAD. Live balance: 7,000 MAD.');
    }
}

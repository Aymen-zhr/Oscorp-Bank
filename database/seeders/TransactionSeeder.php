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
        $now = Carbon::now();
        
        DB::table('transactions')->insert([
            [
                'merchant' => 'PlayStation',
                'logo_color' => '#0041ff',
                'card_last4' => '0224',
                'amount' => -19.99,
                'type' => 'debit',
                'category' => 'Entertainment',
                'transacted_at' => $now->copy()->subDays(2)->setHour(15)->setMinute(20),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'merchant' => 'Netflix',
                'logo_color' => '#e50914',
                'card_last4' => '0224',
                'amount' => -30.00,
                'type' => 'debit',
                'category' => 'Entertainment',
                'transacted_at' => $now->copy()->subDays(4)->setHour(17)->setMinute(11),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'merchant' => 'Airbnb',
                'logo_color' => '#ff5a5f',
                'card_last4' => '4432',
                'amount' => -300.00,
                'type' => 'debit',
                'category' => 'Travel',
                'transacted_at' => $now->copy()->subDays(4)->setHour(13)->setMinute(20),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'merchant' => 'Tommy C.',
                'logo_color' => '#BF00FF',
                'card_last4' => '0224',
                'amount' => 27.00,
                'type' => 'credit',
                'category' => 'Transfer',
                'transacted_at' => $now->copy()->subDays(6)->setHour(2)->setMinute(31),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'merchant' => 'Apple',
                'logo_color' => '#ffffff',
                'card_last4' => '4432',
                'amount' => -10.00,
                'type' => 'debit',
                'category' => 'Software',
                'transacted_at' => $now->copy()->subDays(6)->setHour(23)->setMinute(4),
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}

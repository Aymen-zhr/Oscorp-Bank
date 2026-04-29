<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'George',
            'email' => 'george@oscorp.com',
            'password' => bcrypt('password'),
            'created_at' => now()->subYears(3),
            'updated_at' => now()->subYears(3),
        ]);

        $this->call([
            TransactionSeeder::class,
        ]);
    }
}

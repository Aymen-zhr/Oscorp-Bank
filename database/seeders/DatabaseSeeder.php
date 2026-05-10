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
            'name' => env('SEEDER_ADMIN_NAME', 'Admin'),
            'email' => env('SEEDER_ADMIN_EMAIL', 'admin@oscorp.com'),
            'password' => bcrypt(env('SEEDER_ADMIN_PASSWORD', 'password')),
            'is_admin' => true,
            'created_at' => now()->subYears(3),
            'updated_at' => now()->subYears(3),
        ]);

        User::factory()->create([
            'name' => env('SEEDER_USER_NAME', 'George'),
            'email' => env('SEEDER_USER_EMAIL', 'george@oscorp.com'),
            'password' => bcrypt(env('SEEDER_USER_PASSWORD', 'password')),
            'created_at' => now()->subYears(3),
            'updated_at' => now()->subYears(3),
        ]);

        $this->call([
            TransactionSeeder::class,
        ]);
    }
}

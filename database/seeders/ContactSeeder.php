<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $george = User::where('is_admin', false)->first();
        if (!$george) {
            $this->command->info('No non-admin user found. Creating George...');
            $george = User::factory()->create([
                'name' => env('SEEDER_USER_NAME', 'George'),
                'email' => env('SEEDER_USER_EMAIL', 'george@oscorp.com'),
                'password' => bcrypt(env('SEEDER_USER_PASSWORD', 'password')),
            ]);
        }

        $contactUsers = User::where('id', '!=', $george->id)->take(5)->get();

        if ($contactUsers->count() < 5) {
            $this->command->info('Not enough users for contacts. Creating additional users...');
            for ($i = 0; $i < 5; $i++) {
                User::factory()->create([
                    'name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'password' => bcrypt('password'),
                ]);
            }
            $contactUsers = User::where('id', '!=', $george->id)->take(5)->get();
        }

        $names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson'];
        $colors = ['#D4AF37', '#10B981', '#6366F1', '#F59E0B', '#EC4899'];

        foreach ($contactUsers as $i => $contactUser) {
            DB::table('contacts')->updateOrInsert(
                [
                    'user_id' => $george->id,
                    'contact_user_id' => $contactUser->id,
                ],
                [
                    'nickname' => $names[$i] ?? null,
                    'avatar_color' => $colors[$i] ?? '#64748B',
                    'status' => 'accepted',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Added ' . min(5, $contactUsers->count()) . ' contacts for ' . $george->name);
    }
}

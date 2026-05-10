<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed initial settings
        DB::table('settings')->insert([
            ['key' => 'app_name', 'value' => 'OSCORP Banking', 'type' => 'string', 'description' => 'Application name', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'app_url', 'value' => '', 'type' => 'string', 'description' => 'Application URL', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean', 'description' => 'Enable maintenance mode', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'registration_enabled', 'value' => '1', 'type' => 'boolean', 'description' => 'Allow new registrations', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'min_loan_amount', 'value' => '1000', 'type' => 'numeric', 'description' => 'Minimum loan amount', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_loan_amount', 'value' => '500000', 'type' => 'numeric', 'description' => 'Maximum loan amount', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'default_loan_rate', 'value' => '5.5', 'type' => 'numeric', 'description' => 'Default loan interest rate', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'transfer_fee_percent', 'value' => '1.5', 'type' => 'numeric', 'description' => 'Transfer fee percentage', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'support_email', 'value' => 'support@oscorp.com', 'type' => 'string', 'description' => 'Support email address', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_daily_transfer', 'value' => '50000', 'type' => 'numeric', 'description' => 'Maximum daily transfer limit', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'currency_symbol', 'value' => 'MAD', 'type' => 'string', 'description' => 'Currency symbol', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'enable_2fa', 'value' => '1', 'type' => 'boolean', 'description' => 'Enable two-factor authentication', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
};

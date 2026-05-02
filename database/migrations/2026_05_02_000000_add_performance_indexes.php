<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('type');
            $table->index('category');
            $table->index('transacted_at');
            $table->index('merchant');
            $table->index(['type', 'transacted_at']);
            $table->index(['category', 'transacted_at']);
        });

        Schema::table('goals', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('status');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->index('read_at');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['category']);
            $table->dropIndex(['transacted_at']);
            $table->dropIndex(['merchant']);
            $table->dropIndex(['type', 'transacted_at']);
            $table->dropIndex(['category', 'transacted_at']);
        });

        Schema::table('goals', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['read_at']);
        });
    }
};

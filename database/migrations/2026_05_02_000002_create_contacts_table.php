<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nickname')->nullable();
            $table->string('avatar_color')->default('#64748B');
            $table->timestamps();

            $table->unique(['user_id', 'contact_user_id']);
        });

        Schema::table('bill_splits', function (Blueprint $table) {
            if (!Schema::hasColumn('bill_splits', 'creator_id')) {
                $table->foreignId('creator_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
            }
        });

        Schema::table('bill_participants', function (Blueprint $table) {
            if (!Schema::hasColumn('bill_participants', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('bill_split_id')->constrained()->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('bill_participants', function (Blueprint $table) {
            if (Schema::hasColumn('bill_participants', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });

        Schema::table('bill_splits', function (Blueprint $table) {
            if (Schema::hasColumn('bill_splits', 'creator_id')) {
                $table->dropForeign(['creator_id']);
                $table->dropColumn('creator_id');
            }
        });

        Schema::dropIfExists('contacts');
    }
};

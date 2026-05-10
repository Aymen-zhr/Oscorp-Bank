<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cin')->nullable()->unique()->after('email');
            $table->date('date_of_birth')->nullable()->after('cin');
            $table->string('place_of_birth')->nullable()->after('date_of_birth');
            $table->string('nationality')->nullable()->after('place_of_birth');
            $table->enum('gender', ['male', 'female'])->nullable()->after('nationality');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cin', 'date_of_birth', 'place_of_birth', 'nationality', 'gender']);
        });
    }
};

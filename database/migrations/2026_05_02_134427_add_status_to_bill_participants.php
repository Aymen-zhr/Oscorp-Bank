<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bill_participants', function (Blueprint $table) {
            $table->string('acceptance_status')->default('pending');
        });
    }

    public function down(): void
    {
        Schema::table('bill_participants', function (Blueprint $table) {
            $table->dropColumn('acceptance_status');
        });
    }
};

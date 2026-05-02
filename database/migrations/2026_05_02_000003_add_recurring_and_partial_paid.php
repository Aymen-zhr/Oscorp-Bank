<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bill_splits', function (Blueprint $table) {
            if (!Schema::hasColumn('bill_splits', 'is_recurring')) {
                $table->boolean('is_recurring')->default(false)->after('split_type');
                $table->string('recurring_period')->nullable()->after('is_recurring');
            }
        });

        Schema::table('bill_participants', function (Blueprint $table) {
            if (!Schema::hasColumn('bill_participants', 'partial_paid')) {
                $table->decimal('partial_paid', 10, 2)->default(0)->after('has_paid');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bill_splits', function (Blueprint $table) {
            if (Schema::hasColumn('bill_splits', 'is_recurring')) {
                $table->dropColumn(['is_recurring', 'recurring_period']);
            }
        });

        Schema::table('bill_participants', function (Blueprint $table) {
            if (Schema::hasColumn('bill_participants', 'partial_paid')) {
                $table->dropColumn('partial_paid');
            }
        });
    }
};

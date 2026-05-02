<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bill_splits', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('icon')->default('receipt');
            $table->string('logo_color')->default('#D4AF37');
            $table->string('status')->default('active'); // active, paid, expired
            $table->string('split_type')->default('equal'); // equal, custom
            $table->decimal('your_share', 10, 2)->default(0);
            $table->boolean('you_owe')->default(true); // true = you owe others, false = others owe you
            $table->timestamp('due_date')->nullable();
            $table->timestamps();
        });

        Schema::create('bill_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_split_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone_number')->nullable();
            $table->string('tag')->nullable(); // e.g. @username or relation
            $table->string('avatar_color')->default('#64748B');
            $table->decimal('share_amount', 10, 2)->default(0);
            $table->boolean('is_you')->default(false);
            $table->boolean('has_paid')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bill_participants');
        Schema::dropIfExists('bill_splits');
    }
};

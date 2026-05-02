<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('goals:process-automatic')]
#[Description('Process all automatic monthly goal savings allocations')]
class ProcessAutomaticSavings extends Command
{
    public function handle()
    {
        $this->info('Starting automatic savings process...');

        $goals = \App\Models\Goal::where('is_automatic', true)
            ->where('status', 'active')
            ->get();

        $count = 0;
        foreach ($goals as $goal) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($goal, &$count) {
                $amount = $goal->monthly_savings;

                // 1. Create the debit transaction
                \Illuminate\Support\Facades\DB::table('transactions')->insert([
                    'user_id' => $goal->user_id,
                    'merchant' => 'Automatic Savings: ' . $goal->name,
                    'amount' => $amount,
                    'type' => 'debit',
                    'category' => 'savings',
                    'status' => 'completed',
                    'transacted_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                    'note' => 'Automatic monthly allocation for goal: ' . $goal->name,
                ]);

                // 2. Update goal savings
                $goal->current_savings += $amount;
                
                if ($goal->is_completed) {
                    $goal->status = 'completed';
                    $goal->completed_at = now();
                }
                
                $goal->save();
                $count++;
            });
        }

        $this->info("Successfully processed {$count} automatic savings.");
    }
}

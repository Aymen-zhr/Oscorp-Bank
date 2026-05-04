<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;

class DashboardController extends Controller
{
    use HasOscorpBalance;

    public function index()
    {
        $userId = \Illuminate\Support\Facades\Auth::id();
        $baseBalance = $this->getBaseBalance();
        
        $transactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->orderBy('transacted_at', 'desc')
            ->take(8)
            ->get();
            
        $stats = $this->getFinancialStats();
        
        // Fetch the user's most relevant active goal
        $activeGoal = \App\Models\Goal::where('user_id', \Illuminate\Support\Facades\Auth::id())
            ->where('status', 'active')
            ->orderBy('target_date', 'asc')
            ->first();

        $goalData = null;
        if ($activeGoal) {
            $goalData = [
                'name' => $activeGoal->name,
                'current_savings' => (float) $activeGoal->current_savings,
                'target_amount' => (float) $activeGoal->target_amount,
                'progress' => $activeGoal->progress,
            ];
        }
            
        return Inertia::render('dashboard', [
            'transactions'       => $transactions,
            'activeGoal'         => $goalData,
        ]);
    }
}

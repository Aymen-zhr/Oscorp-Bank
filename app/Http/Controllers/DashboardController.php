<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Goal;
use App\Traits\HasOscorpBalance;

class DashboardController extends Controller
{
    use HasOscorpBalance;

    public function index()
    {
        $userId = Auth::id();

        $transactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->orderBy('transacted_at', 'desc')
            ->take(config('oscorp.limits.recent_transactions', 8))
            ->get();
            
        $stats = $this->getFinancialStats();
        
        $activeGoal = Goal::where('user_id', $userId)
            ->where('status', Goal::STATUS_ACTIVE)
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

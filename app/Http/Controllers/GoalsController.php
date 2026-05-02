<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GoalsController extends Controller
{
    public function page()
    {
        $goals = Goal::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'name' => $goal->name,
                    'icon' => $goal->icon,
                    'target_amount' => (float) $goal->target_amount,
                    'target_months' => $goal->target_months,
                    'monthly_savings' => (float) $goal->monthly_savings,
                    'current_savings' => (float) $goal->current_savings,
                    'start_date' => $goal->start_date->format('Y-m-d'),
                    'target_date' => $goal->target_date?->format('Y-m-d'),
                    'status' => $goal->status,
                    'completed_at' => $goal->completed_at?->format('Y-m-d H:i:s'),
                    'progress' => $goal->progress,
                    'remaining_amount' => $goal->remaining_amount,
                    'is_completed' => $goal->is_completed,
                    'is_automatic' => (bool) $goal->is_automatic,
                ];
            });

        return Inertia::render('goals', [
            'goals' => $goals,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'target_amount' => 'required|numeric|min:1',
            'target_months' => 'required|integer|min:1|max:120',
            'is_automatic' => 'boolean',
        ]);

        $monthlySavings = round($validated['target_amount'] / $validated['target_months'], 2);
        $startDate = now();
        $targetDate = $startDate->copy()->addMonths((int) $validated['target_months']);

        $goal = Goal::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? 'target',
            'target_amount' => $validated['target_amount'],
            'target_months' => $validated['target_months'],
            'monthly_savings' => $monthlySavings,
            'current_savings' => 0,
            'start_date' => $startDate,
            'target_date' => $targetDate,
            'status' => 'active',
            'is_automatic' => $request->boolean('is_automatic'),
        ]);

        return redirect()->route('goals');
    }

    public function deposit(Request $request, Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $wasCompleted = $goal->is_completed;

        $goal->current_savings += $validated['amount'];

        if ($goal->is_completed && !$wasCompleted) {
            $goal->status = 'completed';
            $goal->completed_at = now();
        }

        $goal->save();

        return redirect()->route('goals');
    }

    public function unlock(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        if (!$goal->is_completed) {
            return redirect()->route('goals');
        }

        $goal->status = 'unlocked';
        $goal->save();

        return redirect()->route('goals');
    }

    public function destroy(Goal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            abort(403);
        }

        $goal->delete();

        return redirect()->route('goals');
    }
}

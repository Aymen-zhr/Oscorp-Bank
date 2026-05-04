<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AllocationsController extends Controller
{
    public function page()
    {
        $userId = Auth::id();
        // Calculate category allocations from debit transactions
        $categoryMap = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->select('category', DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(function($cat) {
                return [
                    'name' => $cat->category ?: 'Other',
                    'amount' => round($cat->total, 2),
                ];
            })->toArray();

        // If no categories, provide defaults for the showcase
        if (empty($categoryMap)) {
            $categoryMap = config('allocations.demo_assets', [
                ['name' => 'Real Estate', 'amount' => 120000],
                ['name' => 'Vehicles', 'amount' => 55000],
                ['name' => 'Philanthropy', 'amount' => 15000],
                ['name' => 'Luxury Goods', 'amount' => 8500],
                ['name' => 'Travel', 'amount' => 34000],
            ]);
        }

        $totalAllocation = array_reduce($categoryMap, fn($sum, $cat) => $sum + $cat['amount'], 0);

        return Inertia::render('allocations', [
            'categories' => $categoryMap,
            'totalAllocation' => round($totalAllocation, 2),
        ]);
    }
}

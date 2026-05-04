<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasOscorpBalance;
use Carbon\Carbon;

class ReportsController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $userId = Auth::id();
        $stats = $this->getFinancialStats();

        $trendMonths = config('reports.trend_months', 6);
        $monthsOffset = $trendMonths - 1;
        $trendStart = Carbon::now()->subMonths($monthsOffset)->startOfMonth();
        
        $transactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('transacted_at', '>=', $trendStart)
            ->get();

        // Group by year-month in PHP
        $monthlyAgg = [];
        foreach ($transactions as $tx) {
            $dt = Carbon::parse($tx->transacted_at);
            $key = $dt->format('Y-m');
            if (!isset($monthlyAgg[$key])) {
                $monthlyAgg[$key] = ['income' => 0, 'expenses' => 0, 'year' => $dt->year, 'month_num' => $dt->month, 'month' => $dt->format('M')];
            }
            if ($tx->type === 'credit') {
                $monthlyAgg[$key]['income'] += $tx->amount;
            } else {
                $monthlyAgg[$key]['expenses'] += $tx->amount;
            }
        }

        // Build complete trend array with zero-filled gaps
        $monthlyData = [];
        for ($i = $monthsOffset; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $key = $month->format('Y-m');
            $agg = $monthlyAgg[$key] ?? ['income' => 0, 'expenses' => 0];

            $monthlyData[] = [
                'month' => $month->format('M'),
                'income' => (float) $agg['income'],
                'expenses' => (float) $agg['expenses'],
            ];
        }

        // Spending breakdown - single query with fallback
        $currentMonthStart = Carbon::now()->startOfMonth();
        
        $categoriesQuery = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->whereNotNull('category');
        
        // Try current month first, fallback to all time if empty
        $totalExpenses = (clone $categoriesQuery)
            ->where('transacted_at', '>=', $currentMonthStart)
            ->sum('amount');

        if ($totalExpenses == 0) {
            $totalExpenses = DB::table('transactions')
                ->where('user_id', $userId)
                ->where('type', 'debit')
                ->sum('amount');
        } else {
            $categoriesQuery = (clone $categoriesQuery)
                ->where('transacted_at', '>=', $currentMonthStart);
        }

        $categoriesData = $categoriesQuery
            ->select('category', DB::raw('SUM(amount) as amount'))
            ->groupBy('category')
            ->orderByDesc('amount')
            ->take(6)
            ->get();

        $spendingCategories = [];
        foreach ($categoriesData as $cat) {
            $spendingCategories[] = [
                'category' => $cat->category,
                'amount' => 'MAD ' . number_format($cat->amount, 0),
                'percentage' => $totalExpenses > 0 ? round(($cat->amount / $totalExpenses) * 100) : 0,
            ];
        }

        // Stat calculations
        $netSavings = $stats['total_credits'] - $stats['total_debits'];
        $netSavingsChange = $netSavings > 0 ? '+5.2%' : '-1.4%';

        $reportCategories = [
            ['name' => 'Income Summary', 'type' => 'Income', 'period' => 'Monthly', 'status' => 'Ready', 'date' => date('Y-m-d'), 'icon' => 'TrendingUp', 'color' => '#34D399'],
            ['name' => 'Expense Breakdown', 'type' => 'Expenses', 'period' => 'Monthly', 'status' => 'Ready', 'date' => date('Y-m-d'), 'icon' => 'TrendingDown', 'color' => '#EF4444'],
            ['name' => 'Cash Flow Analysis', 'type' => 'Cash Flow', 'period' => 'Quarterly', 'status' => 'Ready', 'date' => date('Y-m-d'), 'icon' => 'BarChart3', 'color' => 'var(--color-gold)'],
            ['name' => 'Spending by Category', 'type' => 'Expenses', 'period' => 'Monthly', 'status' => 'Ready', 'date' => date('Y-m-d'), 'icon' => 'PieChart', 'color' => '#8B5CF6'],
            ['name' => 'Investment Performance', 'type' => 'Investments', 'period' => 'Annual', 'status' => 'Processing', 'date' => date('Y-m-d'), 'icon' => 'LineChart', 'color' => '#3B82F6'],
            ['name' => 'Net Worth Statement', 'type' => 'Assets', 'period' => 'Quarterly', 'status' => 'Ready', 'date' => date('Y-m-d'), 'icon' => 'FileText', 'color' => '#10B981'],
        ];

        return Inertia::render('reports', [
            'stats' => [
                'total_credits' => number_format($stats['total_credits'], 0),
                'total_debits' => number_format($stats['total_debits'], 0),
                'net_savings' => number_format($netSavings, 0),
                'net_savings_change' => $netSavingsChange,
                'net_savings_positive' => $netSavings >= 0,
            ],
            'monthlyData' => $monthlyData,
            'spendingCategories' => $spendingCategories,
            'reportCategories' => $reportCategories,
        ]);
    }
}
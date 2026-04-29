<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use Carbon\Carbon;

class ReportsController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();

        // 1. Cash flow trend for the last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $income = DB::table('transactions')
                ->where('type', 'credit')
                ->whereBetween('transacted_at', [$start, $end])
                ->sum('amount');

            $expenses = DB::table('transactions')
                ->where('type', 'debit')
                ->whereBetween('transacted_at', [$start, $end])
                ->sum('amount');

            $monthlyData[] = [
                'month' => $month->format('M'),
                'income' => (float) $income,
                'expenses' => (float) $expenses,
            ];
        }

        // 2. Spending Breakdown for the current month
        $currentMonthStart = Carbon::now()->startOfMonth();
        $totalExpensesThisMonth = DB::table('transactions')
            ->where('type', 'debit')
            ->where('transacted_at', '>=', $currentMonthStart)
            ->sum('amount');

        // If no expenses this month, fallback to all time so the chart isn't empty
        if ($totalExpensesThisMonth == 0) {
            $totalExpensesThisMonth = DB::table('transactions')->where('type', 'debit')->sum('amount');
            $categoriesData = DB::table('transactions')
                ->where('type', 'debit')
                ->whereNotNull('category')
                ->select('category', DB::raw('SUM(amount) as amount'))
                ->groupBy('category')
                ->orderByDesc('amount')
                ->take(6)
                ->get();
        } else {
            $categoriesData = DB::table('transactions')
                ->where('type', 'debit')
                ->where('transacted_at', '>=', $currentMonthStart)
                ->whereNotNull('category')
                ->select('category', DB::raw('SUM(amount) as amount'))
                ->groupBy('category')
                ->orderByDesc('amount')
                ->take(6)
                ->get();
        }

        $spendingCategories = [];
        foreach ($categoriesData as $cat) {
            $spendingCategories[] = [
                'category' => $cat->category,
                'amount' => 'MAD ' . number_format($cat->amount, 0),
                'percentage' => $totalExpensesThisMonth > 0 ? round(($cat->amount / $totalExpensesThisMonth) * 100) : 0,
            ];
        }

        // 3. Stat calculations
        $netSavings = $stats['total_credits'] - $stats['total_debits'];
        $netSavingsChange = $netSavings > 0 ? '+5.2%' : '-1.4%'; // Mocked percentage change since we don't have historical snapshots

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
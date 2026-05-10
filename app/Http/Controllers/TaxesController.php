<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasOscorpBalance;

class TaxesController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $userId = Auth::id();
        $stats = $this->getFinancialStats();
        $startOfYear = Carbon::now()->startOfYear();

        // Calculate total income this year from real transactions
        $totalIncomeThisYear = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'credit')
            ->where('transacted_at', '>=', $startOfYear)
            ->sum('amount');

        if ($totalIncomeThisYear == 0) {
            $totalIncomeThisYear = $stats['total_credits'] > 0 ? $stats['total_credits'] : config('taxes.default_income', 500000);
        }

        // Moroccan progressive tax calculation
        $estimatedAnnualTax = $this->calculateMoroccanTax($totalIncomeThisYear);

        // Calculate tax paid from specific tax-related transactions
        $taxPaidThisYear = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('transacted_at', '>=', $startOfYear)
            ->where(function($q) {
                $q->where('category', 'like', '%Tax%')
                  ->orWhere('category', 'like', '%tax%')
                  ->orWhere('merchant', 'like', '%Tax%')
                  ->orWhere('merchant', 'like', '%Impot%');
            })
            ->sum('amount');

        // Calculate deductions from charitable/education/health categories
        $taxDeductions = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('transacted_at', '>=', $startOfYear)
            ->whereIn('category', config('taxes.deductible_categories', ['Health', 'Education', 'Philanthropy', 'Donations']))
            ->sum('amount');

        // Build tax documents from real data
        $taxDocuments = [
            [
                'id' => 'TAX-ANNUAL-' . Carbon::now()->year,
                'name' => 'Annual Tax Return ' . Carbon::now()->year,
                'type' => 'Annual',
                'status' => Carbon::now()->month > 3 ? 'Filed' : 'Pending',
                'date' => Carbon::now()->subDays(30)->format('Y-m-d'),
                'amount' => round($estimatedAnnualTax),
                'icon' => Carbon::now()->month > 3 ? 'CheckCircle' : 'Clock',
            ],
            [
                'id' => 'TAX-Q1-' . Carbon::now()->year,
                'name' => 'Q1 Tax Summary',
                'type' => 'Quarterly',
                'status' => Carbon::now()->month > 4 ? 'Filed' : 'Pending',
                'date' => Carbon::now()->subDays(60)->format('Y-m-d'),
                'amount' => round($estimatedAnnualTax / 4),
                'icon' => Carbon::now()->month > 4 ? 'CheckCircle' : 'Clock',
            ],
        ];

        // If we have real tax transactions, add them as documents
        $taxTransactions = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('transacted_at', '>=', Carbon::now()->subMonths(6))
            ->where(function($q) {
                $q->where('category', 'like', '%Tax%')
                  ->orWhere('category', 'like', '%tax%');
            })
            ->orderByDesc('transacted_at')
            ->get();

        foreach ($taxTransactions as $tx) {
            $taxDocuments[] = [
                'id' => 'TAX-TXN-' . $tx->id,
                'name' => $tx->merchant . ' Payment',
                'type' => 'Payment',
                'status' => 'Filed',
                'date' => Carbon::parse($tx->transacted_at)->format('Y-m-d'),
                'amount' => round($tx->amount),
                'icon' => 'CheckCircle',
            ];
        }

        // Build tax categories from actual spending breakdown
        $categoryTotals = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('transacted_at', '>=', $startOfYear)
            ->whereNotNull('category')
            ->select('category', DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        $totalCategorized = $categoryTotals->sum('total');
        $taxColors = config('taxes.colors.category_colors', ['var(--color-gold)', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6']);

        $taxCategories = [];
        foreach ($categoryTotals as $i => $cat) {
            $taxCategories[] = [
                'category' => $cat->category,
                'amount' => round($cat->total, 2),
                'percentage' => $totalCategorized > 0 ? round(($cat->total / $totalCategorized) * 100) : 0,
                'color' => $taxColors[$i % count($taxColors)],
            ];
        }

        // Upcoming deadlines based on Moroccan tax calendar
        $now = Carbon::now();
        $currentYear = $now->year;

        $deadlineDefs = [
            ['month' => 3, 'day' => 31, 'description' => 'Annual Tax Filing Deadline'],
            ['month' => 4, 'day' => 30, 'description' => 'Q1 Quarterly Tax Payment'],
            ['month' => 7, 'day' => 31, 'description' => 'Q2 Quarterly Tax Payment'],
            ['month' => 10, 'day' => 31, 'description' => 'Q3 Quarterly Tax Payment'],
        ];

        $candidates = [];
        foreach ($deadlineDefs as $def) {
            $dateThisYear = Carbon::create($currentYear, $def['month'], $def['day'], 23, 59, 59);
            $date = $dateThisYear->isPast() && $def['month'] <= 3
                ? Carbon::create($currentYear + 1, $def['month'], $def['day'], 23, 59, 59)
                : $dateThisYear;
            $daysLeft = $now->diffInDays($date, false);
            if ($daysLeft >= 0) {
                $candidates[] = [
                    'deadline' => $date->format('Y-m-d'),
                    'description' => $date->year > $currentYear ? 'Next ' . lcfirst($def['description']) : $def['description'],
                    'daysLeft' => (int) ceil($daysLeft),
                ];
            }
        }

        usort($candidates, fn($a, $b) => $a['daysLeft'] <=> $b['daysLeft']);
        $upcomingDeadlines = array_slice($candidates, 0, 3);

        $pendingPayment = max(0, round($estimatedAnnualTax - $taxPaidThisYear));

        return Inertia::render('taxes', [
            'taxDocuments' => $taxDocuments,
            'taxCategories' => $taxCategories,
            'upcomingDeadlines' => $upcomingDeadlines,
            'stats' => [
                'totalPaidThisYear' => round($taxPaidThisYear, 2),
                'pendingPayment' => $pendingPayment,
                'estimatedAnnual' => round($estimatedAnnualTax, 2),
                'taxDeductions' => round($taxDeductions, 2),
            ]
        ]);
    }

    /**
     * Calculate Moroccan progressive income tax
     * Based on Moroccan IR (Impôt sur le Revenu) brackets
     */
    private function calculateMoroccanTax($annualIncome)
    {
        $brackets = config('taxes.brackets');
        $tax = 0;

        foreach ($brackets as $i => $bracket) {
            $nextThreshold = $brackets[$i + 1]['threshold'] ?? PHP_INT_MAX;

            if ($annualIncome <= $bracket['threshold']) {
                $prevThreshold = $i > 0 ? $brackets[$i - 1]['threshold'] : 0;
                $tax = $bracket['cumulative'] + ($annualIncome - $prevThreshold) * $bracket['rate'];
                break;
            }
        }

        return $tax;
    }
}

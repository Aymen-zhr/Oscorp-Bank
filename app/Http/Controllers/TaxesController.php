<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;

class TaxesController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        // Calculate estimated annual tax based on a simple percentage of total credits this year
        $startOfYear = Carbon::now()->startOfYear();
        $totalIncomeThisYear = DB::table('transactions')
            ->where('type', 'credit')
            ->where('transacted_at', '>=', $startOfYear)
            ->sum('amount');
            
        if ($totalIncomeThisYear == 0) {
            $totalIncomeThisYear = 500000; // fallback mock
        }
        
        $estimatedAnnualTax = $totalIncomeThisYear * 0.25; // 25% tax bracket assumption
        
        $taxDocuments = [
            ['id' => 'TAX-Q1', 'name' => 'Q1 Tax Summary', 'type' => 'Quarterly', 'status' => 'Filed', 'date' => Carbon::now()->subDays(15)->format('Y-m-d'), 'amount' => 12450, 'icon' => 'CheckCircle'],
            ['id' => 'TAX-ANNUAL', 'name' => 'Annual Tax Return', 'type' => 'Annual', 'status' => 'Filed', 'date' => Carbon::now()->subDays(30)->format('Y-m-d'), 'amount' => 48200, 'icon' => 'CheckCircle'],
            ['id' => 'TAX-Q2', 'name' => 'Q2 Tax Summary', 'type' => 'Quarterly', 'status' => 'Pending', 'date' => Carbon::now()->addDays(78)->format('Y-m-d'), 'amount' => 14800, 'icon' => 'Clock'],
            ['id' => 'TAX-Q4', 'name' => 'Q4 Tax Summary', 'type' => 'Quarterly', 'status' => 'Filed', 'date' => Carbon::now()->subDays(105)->format('Y-m-d'), 'amount' => 11200, 'icon' => 'CheckCircle'],
            ['id' => 'TAX-Q3', 'name' => 'Q3 Tax Summary', 'type' => 'Quarterly', 'status' => 'Filed', 'date' => Carbon::now()->subDays(190)->format('Y-m-d'), 'amount' => 10800, 'icon' => 'CheckCircle'],
        ];

        $taxCategories = [
            ['category' => 'Income Tax', 'amount' => 42500, 'percentage' => 52, 'color' => 'var(--color-gold)'],
            ['category' => 'Corporate Tax', 'amount' => 18200, 'percentage' => 22, 'color' => '#6366F1'],
            ['category' => 'VAT', 'amount' => 12400, 'percentage' => 15, 'color' => '#10B981'],
            ['category' => 'Property Tax', 'amount' => 6800, 'percentage' => 8, 'color' => '#F59E0B'],
            ['category' => 'Other Taxes', 'amount' => 2550, 'percentage' => 3, 'color' => '#8B5CF6'],
        ];

        $upcomingDeadlines = [
            ['deadline' => Carbon::now()->addDays(78)->format('Y-m-d'), 'description' => 'Q2 Quarterly Tax Payment', 'daysLeft' => 78],
            ['deadline' => Carbon::now()->addDays(169)->format('Y-m-d'), 'description' => 'Q3 Quarterly Tax Payment', 'daysLeft' => 169],
            ['deadline' => Carbon::now()->addDays(336)->format('Y-m-d'), 'description' => 'Annual Tax Return', 'daysLeft' => 336],
        ];

        return Inertia::render('taxes', [
            'taxDocuments' => $taxDocuments,
            'taxCategories' => $taxCategories,
            'upcomingDeadlines' => $upcomingDeadlines,
            'stats' => [
                'totalPaidThisYear' => 12450,
                'pendingPayment' => 14800,
                'estimatedAnnual' => round($estimatedAnnualTax),
                'taxDeductions' => 8500,
            ]
        ]);
    }
}
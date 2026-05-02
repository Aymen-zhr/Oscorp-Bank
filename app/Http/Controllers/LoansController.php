<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;

class LoansController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();

        // Calculate payments made this year from transactions
        $paidOffThisYear = DB::table('transactions')
            ->where('type', 'debit')
            ->where('transacted_at', '>=', Carbon::now()->startOfYear())
            ->where(function($q) {
                $q->where('merchant', 'like', '%Loan%')
                  ->orWhere('merchant', 'like', '%Mortgage%')
                  ->orWhere('category', 'Loan Payment')
                  ->orWhere('category', 'Mortgage');
            })
            ->sum('amount');

        if ($paidOffThisYear == 0) {
            // Estimate based on total debits
            $paidOffThisYear = round($stats['total_debits'] * 0.15);
        }

        // Active loans (pre-populated for demo)
        $activeLoans = [
            [
                'id' => 'LN-001',
                'type' => 'Home Mortgage',
                'principal' => 1200000,
                'balance' => 985400,
                'rate' => 3.5,
                'monthlyPayment' => 8500,
                'nextPayment' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'status' => 'Active',
                'progress' => round(((1200000 - 985400) / 1200000) * 100),
                'term' => '20 years',
                'icon' => 'Home'
            ],
            [
                'id' => 'LN-002',
                'type' => 'Auto Loan',
                'principal' => 250000,
                'balance' => 142000,
                'rate' => 4.2,
                'monthlyPayment' => 4800,
                'nextPayment' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'status' => 'Active',
                'progress' => round(((250000 - 142000) / 250000) * 100),
                'term' => '5 years',
                'icon' => 'Car'
            ]
        ];

        // Generate amortization schedule for the first loan
        $amortizationSchedule = $this->generateAmortization(
            $activeLoans[0]['balance'],
            $activeLoans[0]['rate'],
            $activeLoans[0]['monthlyPayment']
        );

        // Pre-approved loan offers based on user's financial profile
        $preApprovedLimit = round($stats['live_balance'] * 3);
        $loanOffers = [
            ['type' => 'Personal Loan', 'maxAmount' => min(500000, $preApprovedLimit), 'rate' => 5.5, 'term' => '1-5 years', 'featured' => false, 'icon' => 'User', 'preApproved' => true],
            ['type' => 'Business Loan', 'maxAmount' => 2000000, 'rate' => 4.8, 'term' => '1-10 years', 'featured' => true, 'icon' => 'Briefcase', 'preApproved' => false],
            ['type' => 'Education Loan', 'maxAmount' => 300000, 'rate' => 3.2, 'term' => '1-7 years', 'featured' => false, 'icon' => 'GraduationCap', 'preApproved' => true],
        ];

        $totalOutstanding = collect($activeLoans)->sum('balance');
        $monthlyPayments = collect($activeLoans)->sum('monthlyPayment');
        $averageRate = collect($activeLoans)->avg('rate');

        return Inertia::render('loans', [
            'activeLoans' => $activeLoans,
            'loanOffers' => $loanOffers,
            'amortizationSchedule' => $amortizationSchedule,
            'stats' => [
                'totalOutstanding' => round($totalOutstanding, 2),
                'monthlyPayments' => round($monthlyPayments, 2),
                'averageRate' => round($averageRate, 1),
                'paidOffThisYear' => round($paidOffThisYear, 2),
            ]
        ]);
    }

    /**
     * Generate amortization schedule for a loan
     */
    private function generateAmortization($balance, $annualRate, $monthlyPayment, $months = 12)
    {
        $schedule = [];
        $remainingBalance = $balance;
        $monthlyRate = $annualRate / 100 / 12;

        for ($i = 1; $i <= $months && $remainingBalance > 0; $i++) {
            $interestPayment = $remainingBalance * $monthlyRate;
            $principalPayment = min($monthlyPayment - $interestPayment, $remainingBalance);
            $remainingBalance -= $principalPayment;

            $schedule[] = [
                'month' => Carbon::now()->addMonths($i)->format('M Y'),
                'payment' => round($monthlyPayment, 2),
                'principal' => round($principalPayment, 2),
                'interest' => round($interestPayment, 2),
                'balance' => round(max(0, $remainingBalance), 2),
            ];
        }

        return $schedule;
    }
}

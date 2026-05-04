<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasOscorpBalance;

class LoansController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $userId = Auth::id();
        $stats = $this->getFinancialStats();

        // Calculate payments made this year from transactions
        $paidOffThisYear = DB::table('transactions')
            ->where('user_id', $userId)
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
            $paidOffThisYear = round($stats['total_debits'] * config('loans.estimation_multiplier', 0.15));
        }

        // Active loans (pre-populated for demo)
        $demoLoans = config('loans.demo_loans', []);
        $activeLoans = [];
        foreach ($demoLoans as $loan) {
            $activeLoans[] = [
                'id' => $loan['id'],
                'type' => $loan['type'],
                'principal' => $loan['principal'],
                'balance' => round($stats['live_balance'], 2),
                'rate' => $loan['rate'],
                'monthlyPayment' => $loan['monthly_payment'],
                'nextPayment' => Carbon::now()->addDays($loan['next_payment_days'])->format('Y-m-d'),
                'status' => 'Active',
                'progress' => round((($loan['principal'] - $loan['balance']) / $loan['principal']) * 100),
                'term' => $loan['term'],
                'icon' => $loan['icon'],
            ];
        }

        // Generate amortization schedule for the first loan
        $amortizationSchedule = $this->generateAmortization(
            $activeLoans[0]['balance'],
            $activeLoans[0]['rate'],
            $activeLoans[0]['monthlyPayment'],
            config('loans.amortization_months', 12)
        );

        // Pre-approved loan offers based on user's financial profile
        $preApprovedLimit = round($stats['live_balance'] * config('loans.pre_approved_multiplier', 3));
        $loanOffersConfig = config('loans.offers', []);
        $loanOffers = [];
        foreach ($loanOffersConfig as $offer) {
            $loanOffers[] = [
                'type' => $offer['type'],
                'maxAmount' => min($offer['max_amount'], $preApprovedLimit),
                'rate' => $offer['rate'],
                'term' => $offer['term'],
                'featured' => $offer['featured'],
                'icon' => $offer['icon'],
                'preApproved' => $offer['pre_approved'],
            ];
        }

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

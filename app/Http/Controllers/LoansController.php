<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Traits\HasOscorpBalance;
use App\Models\Loan;

class LoansController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $userId = Auth::id();
        $stats = $this->getFinancialStats();

        // Get real loans from database
        $activeLoans = Loan::where('user_id', $userId)
            ->whereIn('status', ['approved', 'active'])
            ->get()
            ->map(function ($loan) {
                $paidAmount = $loan->paid_amount ?? 0;
                $remainingBalance = max(0, $loan->total_repayment - $paidAmount);
                $progress = $loan->total_repayment > 0 ? round(($paidAmount / $loan->total_repayment) * 100, 1) : 0;

                return [
                    'id' => $loan->id,
                    'type' => $loan->type,
                    'principal' => $loan->amount,
                    'balance' => $remainingBalance,
                    'rate' => $loan->rate,
                    'monthlyPayment' => $loan->monthly_payment,
                    'nextPayment' => $loan->approved_at ? Carbon::parse($loan->approved_at)->addMonth()->format('Y-m-d') : null,
                    'status' => $loan->status,
                    'progress' => $progress,
                    'term' => $loan->term_months . ' months',
                    'icon' => $this->getIconForType($loan->type),
                    'purpose' => $loan->purpose,
                ];
            });

        // If no real loans, show demo loans
        if ($activeLoans->isEmpty()) {
            $demoLoans = config('loans.demo_loans', []);
            $activeLoans = collect();
            foreach ($demoLoans as $loan) {
                $activeLoans->push([
                    'id' => $loan['id'],
                    'type' => $loan['type'],
                    'principal' => $loan['principal'],
                    'balance' => $loan['balance'],
                    'rate' => $loan['rate'],
                    'monthlyPayment' => $loan['monthly_payment'],
                    'nextPayment' => Carbon::now()->addDays($loan['next_payment_days'])->format('Y-m-d'),
                    'status' => Loan::STATUS_ACTIVE,
                    'progress' => round((($loan['principal'] - $loan['balance']) / $loan['principal']) * 100),
                    'term' => $loan['term'],
                    'icon' => $loan['icon'],
                ]);
            }
        }

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
            $paidOffThisYear = round($stats['total_debits'] * config('loans.estimation_multiplier', 0.15));
        }

        // Generate amortization schedule for first loan
        $firstLoan = $activeLoans->first();
        $amortizationSchedule = [];
        if ($firstLoan) {
            $amortizationSchedule = $this->generateAmortization(
                $firstLoan['balance'],
                $firstLoan['rate'],
                $firstLoan['monthlyPayment'],
                config('loans.amortization_months', 12)
            );
        }

        // Pre-approved loan offers
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

        $totalOutstanding = $activeLoans->sum('balance');
        $monthlyPayments = $activeLoans->sum('monthlyPayment');
        $averageRate = $activeLoans->avg('rate');

        // Get pending applications for current user
        $pendingApplications = Loan::where('user_id', $userId)
            ->where('status', 'pending')
            ->get()
            ->map(function ($loan) {
                return [
                    'id' => $loan->id,
                    'type' => $loan->type,
                    'amount' => $loan->amount,
                    'rate' => $loan->rate,
                    'term' => $loan->term_months . ' months',
                    'purpose' => $loan->purpose,
                    'created_at' => $loan->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('loans', [
            'activeLoans' => $activeLoans,
            'loanOffers' => $loanOffers,
            'amortizationSchedule' => $amortizationSchedule,
            'pendingApplications' => $pendingApplications,
            'stats' => [
                'totalOutstanding' => round($totalOutstanding, 2),
                'monthlyPayments' => round($monthlyPayments, 2),
                'averageRate' => round($averageRate, 1),
                'paidOffThisYear' => round($paidOffThisYear, 2),
            ]
        ]);
    }

    public function apply(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:10000|max:2000000',
            'rate' => 'nullable|numeric|min:1|max:15',
            'term_months' => 'required|integer|min:1|max:360',
            'purpose' => 'nullable|string|max:500',
        ]);

        // Look up rate from config if not provided
        $rate = $validated['rate'];
        if (is_null($rate)) {
            $rate = collect(config('loans.offers', []))
                ->firstWhere('type', $validated['type'])['rate'] ?? 5.5;
        }
        $monthlyPayment = $this->calculateMonthlyPayment(
            $validated['amount'],
            $rate,
            $validated['term_months']
        );
        $totalRepayment = $monthlyPayment * $validated['term_months'];

        $loan = Loan::create([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'rate' => $rate,
            'term_months' => $validated['term_months'],
            'monthly_payment' => $monthlyPayment,
            'total_repayment' => $totalRepayment,
            'paid_amount' => 0,
            'status' => Loan::STATUS_PENDING,
            'purpose' => $validated['purpose'],
        ]);

        return redirect()->back()->with('success', 'Loan application submitted. Waiting for admin approval.');
    }

    private function calculateMonthlyPayment($principal, $annualRate, $termMonths)
    {
        $monthlyRate = $annualRate / 100 / 12;
        if ($monthlyRate == 0) return round($principal / $termMonths, 2);
        
        $payment = ($principal * $monthlyRate * pow(1 + $monthlyRate, $termMonths)) 
                  / (pow(1 + $monthlyRate, $termMonths) - 1);
        
        return round($payment, 2);
    }

    private function getIconForType($type)
    {
        $iconMap = [
            'Home Mortgage' => 'Home',
            'Auto Loan' => 'Car',
            'Personal Loan' => 'User',
            'Business Loan' => 'Briefcase',
            'Education Loan' => 'GraduationCap',
        ];

        return $iconMap[$type] ?? 'Landmark';
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
                'month' => Carbon::now()->addMonths($i)->format(config('oscorp.date_formats.month_year', 'M Y')),
                'payment' => round($monthlyPayment, 2),
                'principal' => round($principalPayment, 2),
                'interest' => round($interestPayment, 2),
                'balance' => round(max(0, $remainingBalance), 2),
            ];
        }

        return $schedule;
    }
}

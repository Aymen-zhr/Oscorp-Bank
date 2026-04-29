<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;

class LoansController extends Controller
{
    public function page()
    {
        // Logical "fake" data for George
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

        $loanOffers = [
            ['type' => 'Personal Loan', 'maxAmount' => 500000, 'rate' => 5.5, 'term' => '1-5 years', 'featured' => false, 'icon' => 'User'],
            ['type' => 'Business Loan', 'maxAmount' => 2000000, 'rate' => 4.8, 'term' => '1-10 years', 'featured' => true, 'icon' => 'Briefcase'],
            ['type' => 'Education Loan', 'maxAmount' => 300000, 'rate' => 3.2, 'term' => '1-7 years', 'featured' => false, 'icon' => 'GraduationCap'],
        ];

        // Derived stats
        $totalOutstanding = collect($activeLoans)->sum('balance');
        $monthlyPayments = collect($activeLoans)->sum('monthlyPayment');
        $averageRate = collect($activeLoans)->avg('rate');
        $paidOffThisYear = 87300; // Mocked logical value based on payments over a year

        return Inertia::render('loans', [
            'activeLoans' => $activeLoans,
            'loanOffers' => $loanOffers,
            'stats' => [
                'totalOutstanding' => $totalOutstanding,
                'monthlyPayments' => $monthlyPayments,
                'averageRate' => round($averageRate, 1),
                'paidOffThisYear' => $paidOffThisYear,
            ]
        ]);
    }
}
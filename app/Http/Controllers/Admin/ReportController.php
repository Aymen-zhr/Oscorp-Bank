<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $growthDays = config('oscorp.limits.report_user_growth_days', 30);
        $revenueMonths = config('oscorp.limits.report_revenue_months', 12);
        $topUsersLimit = config('oscorp.limits.report_top_users', 10);
        $activeDays = config('oscorp.limits.active_users_days', 7);
        $currency = config('oscorp.currency', 'MAD');

        $userGrowth = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->limit($growthDays)
            ->get();

        $revenueByMonth = DB::table('transactions')
            ->select('transacted_at', 'amount')
            ->get()
            ->groupBy(function ($row) {
                return date('Y-m', strtotime($row->transacted_at));
            })
            ->map(function ($group, $month) {
                return [
                    'month' => $month,
                    'total' => $group->sum('amount'),
                    'count' => $group->count(),
                ];
            })
            ->sortBy('month')
            ->take($revenueMonths)
            ->values();

        $topUsers = User::select('users.id', 'users.name', 'users.email', 'users.tag')
            ->selectRaw('COUNT(transactions.id) as transaction_count')
            ->leftJoin('transactions', 'users.id', '=', 'transactions.user_id')
            ->groupBy('users.id', 'users.name', 'users.email', 'users.tag')
            ->orderByDesc('transaction_count')
            ->limit($topUsersLimit)
            ->get();

        $systemStats = [
            'total_users' => User::count(),
            'active_users_7d' => User::where('updated_at', '>', now()->subDays($activeDays))->count(),
            'total_transactions' => DB::table('transactions')->count(),
            'total_transaction_volume' => DB::table('transactions')->sum('amount'),
            'total_loans' => Loan::count(),
            'total_loan_volume' => Loan::where('status', Loan::STATUS_ACTIVE)->sum('amount'),
            'currency' => $currency,
        ];

        return Inertia::render('admin/reports', [
            'userGrowth' => $userGrowth,
            'revenueByMonth' => $revenueByMonth,
            'topUsers' => $topUsers,
            'systemStats' => $systemStats,
        ]);
    }
}

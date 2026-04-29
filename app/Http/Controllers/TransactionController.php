<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Traits\HasOscorpBalance;

class TransactionController extends Controller
{
    use HasOscorpBalance;

    public function page(Request $request)
    {
        $query = DB::table('transactions')->orderBy('transacted_at', 'desc');

        $type = $request->input('type');
        $category = $request->input('category');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $search = $request->input('search');

        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($dateFrom) {
            $query->where('transacted_at', '>=', Carbon::parse($dateFrom)->startOfDay());
        }

        if ($dateTo) {
            $query->where('transacted_at', '<=', Carbon::parse($dateTo)->endOfDay());
        }

        if ($search) {
            $query->where('merchant', 'like', "%{$search}%");
        }

        $transactions = $query->paginate(20)->withQueryString();

        $stats = $this->getFinancialStats();

        $categories = DB::table('transactions')->distinct()->pluck('category')->filter()->values();

        return \Inertia\Inertia::render('transactions', [
            'transactions' => $transactions,
            'filters' => [
                'type' => $type ?? 'all',
                'category' => $category ?? 'all',
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
                'search' => $search ?? '',
            ],
            'categories' => $categories,
            'stats' => [
                'balance' => round($stats['live_balance'], 2),
                'total_credits' => round($stats['total_credits'], 2),
                'total_debits' => round($stats['total_debits'], 2),
            ],
        ]);
    }
}
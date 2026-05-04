<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use App\Traits\HasOscorpBalance;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class TransactionController extends Controller
{
    use HasOscorpBalance;

    public function page(Request $request)
    {
        $userId = auth()->id();
        $query = DB::table('transactions')->where('user_id', $userId)->orderBy('transacted_at', 'desc');

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

        $transactions = $query->paginate(config('oscorp.limits.pagination', 20))->withQueryString();

        $stats = $this->getFinancialStats();

        $categories = DB::table('transactions')
            ->where('user_id', $userId)
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->values()
            ->toArray();

        return Inertia::render('transactions', [
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
                'total_credits' => round($stats['total_credits'], 2),
                'total_debits' => round($stats['total_debits'], 2),
            ],
        ]);
    }

    /**
     * Export transactions as CSV
     */
    public function export(Request $request)
    {
        $userId = auth()->id();
        $query = DB::table('transactions')->where('user_id', $userId)->orderBy('transacted_at', 'desc');

        // Apply same filters as the page
        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        if ($request->date_from) {
            $query->where('transacted_at', '>=', Carbon::parse($request->date_from)->startOfDay());
        }
        if ($request->date_to) {
            $query->where('transacted_at', '<=', Carbon::parse($request->date_to)->endOfDay());
        }
        if ($request->search) {
            $query->where('merchant', 'like', "%{$request->search}%");
        }

        $transactions = $query->get();

        // Build CSV
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="transactions_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($transactions) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, ['Date', 'Merchant', 'Category', 'Type', 'Amount (MAD)', 'Card']);

            // Data rows
            foreach ($transactions as $tx) {
                fputcsv($file, [
                    Carbon::parse($tx->transacted_at)->format('Y-m-d H:i'),
                    $tx->merchant,
                    $tx->category ?? '',
                    ucfirst($tx->type),
                    $tx->type === 'credit' ? $tx->amount : -$tx->amount,
                    $tx->card_last4 ?? '',
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}

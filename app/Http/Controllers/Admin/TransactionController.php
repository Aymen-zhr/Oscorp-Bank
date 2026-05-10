<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = config('oscorp.limits.pagination', 20);
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $dateFormat = config('oscorp.admin.date_format_long', 'd M Y, H:i');
        $currency = config('oscorp.currency', 'MAD');

        $query = Transaction::with('user')->latest();

        $user = null;
        if ($request->filled('user_id')) {
            $user = User::find($request->user_id);
            if ($user) {
                $query->where('user_id', $user->id);
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('merchant', 'like', "%{$search}%");
        }

        if ($user) {
            $transactions = $query->paginate($perPage);
            $transactions->getCollection()->transform(function ($tx) use ($dateFormat) {
                $tx->transacted_at = $tx->transacted_at?->format($dateFormat);
                return $tx;
            });

            $userCount = Transaction::where('user_id', $user->id)->count();
            $userTxTotal = Transaction::where('user_id', $user->id)->sum('amount');
            $userTxPending = Transaction::where('user_id', $user->id)->where('status', Transaction::STATUS_PENDING)->count();
            $userTxFailed = Transaction::where('user_id', $user->id)->where('status', Transaction::STATUS_FAILED)->count();
        } else {
            $transactions = collect();
            $userCount = 0;
            $userTxTotal = 0;
            $userTxPending = 0;
            $userTxFailed = 0;
        }

        $stats = [
            'total' => Transaction::count(),
            'total_volume' => Transaction::sum('amount'),
            'today_count' => Transaction::whereDate('transacted_at', today())->count(),
            'today_volume' => Transaction::whereDate('transacted_at', today())->sum('amount'),
            'pending' => Transaction::where('status', Transaction::STATUS_PENDING)->count(),
            'failed' => Transaction::where('status', Transaction::STATUS_FAILED)->count(),
            'user_count' => $userCount,
            'user_volume' => $userTxTotal,
            'user_pending' => $userTxPending,
            'user_failed' => $userTxFailed,
            'currency' => $currency,
        ];

        return Inertia::render('admin/transactions', [
            'transactions' => $user ? $transactions : null,
            'stats' => $stats,
            'filters' => $request->only('user_id', 'status', 'type', 'search'),
            'selectedUser' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'tag' => $user->tag,
                'count' => $userCount,
            ] : null,
        ]);
    }

    public function searchUsers(Request $request)
    {
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $search = $request->query('q', '');

        $users = User::where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%");
            })
            ->select('id', 'name', 'email', 'tag')
            ->limit($searchLimit)
            ->get()
            ->map(function ($user) {
                $user->transaction_count = Transaction::where('user_id', $user->id)->count();
                return $user;
            });

        return response()->json($users);
    }

    public function show(Transaction $transaction)
    {
        $dateFormat = config('oscorp.admin.date_format_long', 'd M Y, H:i');

        $transaction->load('user');

        return Inertia::render('admin/transaction-detail', [
            'transaction' => [
                'id' => $transaction->id,
                'merchant' => $transaction->merchant,
                'amount' => $transaction->amount,
                'type' => $transaction->type,
                'category' => $transaction->category,
                'status' => $transaction->status,
                'source' => $transaction->source,
                'note' => $transaction->note,
                'card_last4' => $transaction->card_last4,
                'logo_color' => $transaction->logo_color,
                'transacted_at' => $transaction->transacted_at->format($dateFormat),
                'created_at' => $transaction->created_at->format($dateFormat),
                'user' => $transaction->user ? [
                    'id' => $transaction->user->id,
                    'name' => $transaction->user->name,
                    'email' => $transaction->user->email,
                    'tag' => $transaction->user->tag,
                ] : null,
            ],
        ]);
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Transaction::statuses()),
            'note' => 'nullable|string|max:500',
        ]);

        $transaction->update($validated);

        return redirect()->back()->with('success', 'Transaction status updated.');
    }

    public function flag(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'note' => 'required|string|max:500',
        ]);

        $transaction->update([
            'status' => Transaction::STATUS_PENDING,
            'note' => $validated['note'],
        ]);

        return redirect()->back()->with('success', 'Transaction flagged for review.');
    }
}

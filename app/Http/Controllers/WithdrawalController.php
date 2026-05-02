<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use App\Services\TransactionService;
use App\Services\NotificationService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WithdrawalController extends Controller
{
    use HasOscorpBalance;

    public function __construct(
        protected TransactionService $transactionService,
        protected NotificationService $notificationService
    ) {}

    public function page()
    {
        $stats = $this->getFinancialStats();
        $userId = Auth::id();

        $recentWithdrawals = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('category', 'Withdrawal')
            ->orderBy('transacted_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('withdrawal', [
            'balance' => round($stats['live_balance'], 2),
            'recentWithdrawals' => $recentWithdrawals,
        ]);
    }

    public function store(Request $request)
    {
        $stats = $this->getFinancialStats();
        $liveBalance = $stats['live_balance'];

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:' . config('oscorp.limits.max_withdrawal')],
            'bank' => ['required', 'string', 'max:100'],
            'rib' => ['required', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['amount'] > $liveBalance) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($liveBalance, 2) . ' MAD',
            ]);
        }

        $user = Auth::user();

        DB::transaction(function () use ($validated, $user) {
            $this->transactionService->create([
                'merchant' => 'Withdrawal to ' . $validated['bank'],
                'type' => 'debit',
                'category' => 'Withdrawal',
                'amount' => $validated['amount'],
                'source' => 'Transfer',
                'bank' => $validated['bank'],
                'rib' => $validated['rib'],
                'note' => $validated['note'] ?? null,
                'status' => 'completed',
                'logo_color' => config('oscorp.colors.withdrawal'),
                'transacted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($user) {
                $this->notificationService->createWithdrawalNotification(
                    $user->id,
                    $validated['amount'],
                    $validated['bank']
                );
            }
        });

        return redirect()->route('withdrawal')->with('success', 'Withdrawal of ' . number_format($validated['amount'], 2) . ' MAD initiated.');
    }
}

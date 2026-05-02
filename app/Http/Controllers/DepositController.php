<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use App\Services\TransactionService;
use App\Services\NotificationService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DepositController extends Controller
{
    use HasOscorpBalance;

    public function __construct(
        protected TransactionService $transactionService,
        protected NotificationService $notificationService
    ) {}

    public function page()
    {
        $stats = $this->getFinancialStats();

        return Inertia::render('deposit', [
            'balance' => round($stats['live_balance'], 2),
            'recentDeposits' => $this->transactionService->getLatestByCategory('Deposit', 5),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:' . config('oscorp.limits.max_deposit')],
            'source' => ['required', 'string', 'max:100'],
            'agency' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($validated, $user) {
            $this->transactionService->create([
                'merchant' => 'OSCORP Deposit',
                'type' => 'credit',
                'category' => 'Deposit',
                'amount' => $validated['amount'],
                'source' => $validated['source'],
                'agency' => $validated['agency'] ?? null,
                'note' => $validated['note'] ?? null,
                'status' => 'completed',
                'logo_color' => config('oscorp.colors.deposit'),
                'transacted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($user) {
                $this->notificationService->createDepositNotification(
                    $user->id,
                    $validated['amount'],
                    $validated['source']
                );
            }
        });

        return redirect()->route('deposit')->with('success', 'Deposit of ' . number_format($validated['amount'], 2) . ' MAD confirmed.');
    }
}

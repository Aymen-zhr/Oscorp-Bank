<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use App\Services\TransactionService;
use App\Services\NotificationService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;

class TransferController extends Controller
{
    use HasOscorpBalance;

    public function __construct(
        protected TransactionService $transactionService,
        protected NotificationService $notificationService
    ) {}

    public function page()
    {
        $stats = $this->getFinancialStats();

        return Inertia::render('transfer', [
            'recentTransfers' => $this->transactionService->getLatestByCategory('Transfer', config('oscorp.limits.recent_transfers', 10)),
            'beneficiaries' => $this->transactionService->getBeneficiaries(config('oscorp.limits.beneficiaries', 8)),
        ]);
    }

    public function store(Request $request)
    {
        $stats = $this->getFinancialStats();
        $liveBalance = $stats['live_balance'];

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:' . config('oscorp.limits.max_transfer')],
            'recipient' => ['required', 'string', 'max:100'],
            'recipient_account' => ['nullable', 'string', 'max:50'],
            'bank' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['amount'] > $liveBalance) {
            return back()->withErrors([
                'amount' => 'Insufficient funds. Available balance: ' . number_format($liveBalance, 2) . ' ' . config('oscorp.currency', 'MAD'),
            ]);
        }

        $colors = config('oscorp.colors.transfer');

        $user = Auth::user();

        DB::transaction(function () use ($validated, $user, $colors) {
            $this->transactionService->create([
                'merchant' => $validated['recipient'],
                'type' => 'debit',
                'category' => 'Transfer',
                'amount' => $validated['amount'],
                'note' => $validated['note'] ?? null,
                'status' => Transaction::STATUS_COMPLETED,
                'logo_color' => $colors[array_rand($colors)],
                'card_last4' => config('oscorp.card.last4'),
                'transacted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->notificationService->createTransferNotification(
                $user->id,
                $validated['amount'],
                $validated['recipient']
            );
        });

        return redirect()->route('transfer')->with('success', 'Transfer of ' . number_format($validated['amount'], 2) . ' ' . config('oscorp.currency', 'MAD') . ' to ' . $validated['recipient'] . ' completed successfully.');
    }
}

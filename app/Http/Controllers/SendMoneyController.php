<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use App\Services\TransactionService;
use App\Services\NotificationService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SendMoneyController extends Controller
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

        $recentSends = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('category', 'Sent')
            ->orderBy('transacted_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('send', [
            'balance' => round($stats['live_balance'], 2),
            'recentSends' => $recentSends,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'recipient_id' => ['required', 'exists:users,id'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $stats = $this->getFinancialStats();
        if ($validated['amount'] > $stats['live_balance']) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($stats['live_balance'], 2) . ' MAD',
            ]);
        }

        if ($validated['recipient_id'] == Auth::id()) {
            return back()->withErrors([
                'recipient_id' => 'You cannot send money to yourself.',
            ]);
        }

        $sender = Auth::user();
        $recipient = User::find($validated['recipient_id']);

        DB::transaction(function () use ($validated, $sender, $recipient) {
            // Debit sender
            DB::table('transactions')->insert([
                'user_id' => $sender->id,
                'merchant' => 'Sent to ' . $recipient->name,
                'type' => 'debit',
                'category' => 'Sent',
                'amount' => $validated['amount'],
                'source' => 'Transfer',
                'note' => $validated['note'] ?? null,
                'status' => 'completed',
                'logo_color' => '#EF4444',
                'transacted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Credit recipient
            DB::table('transactions')->insert([
                'user_id' => $recipient->id,
                'merchant' => 'Received from ' . $sender->name,
                'type' => 'credit',
                'category' => 'Received',
                'amount' => $validated['amount'],
                'source' => 'Transfer',
                'note' => $validated['note'] ?? null,
                'status' => 'completed',
                'logo_color' => '#10B981',
                'transacted_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Notify recipient
            $recipient->notify(new \App\Notifications\SystemNotification([
                'type' => 'success',
                'title' => 'Money Received',
                'message' => $sender->name . ' sent you ' . number_format($validated['amount'], 2) . ' MAD',
                'action_type' => 'receive',
                'user_name' => $sender->name,
            ]));

            // Notify sender
            $sender->notify(new \App\Notifications\SystemNotification([
                'type' => 'info',
                'title' => 'Money Sent',
                'message' => 'You sent ' . number_format($validated['amount'], 2) . ' MAD to ' . $recipient->name,
                'action_type' => 'send',
                'user_name' => $sender->name,
            ]));
        });

        return redirect()->route('send')->with('success', 'Sent ' . number_format($validated['amount'], 2) . ' MAD to ' . $recipient->name);
    }
}

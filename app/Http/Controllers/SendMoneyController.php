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

        $contacts = \App\Models\Contact::where('user_id', $userId)
            ->where('status', 'accepted')
            ->with('contactUser:id,name,email,avatar')
            ->get()
            ->map(fn($c) => [
                'id' => $c->contact_user_id,
                'name' => $c->nickname ?? $c->contactUser->name,
                'email' => $c->contactUser->email,
                'avatar' => $c->contactUser->avatar,
            ]);

        return Inertia::render('send', [
            'recentSends' => $recentSends,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'send_mode' => ['required', 'in:contact,rib'],
            'recipient_id' => ['required_if:send_mode,contact', 'nullable', 'exists:users,id'],
            'rib' => ['required_if:send_mode,rib', 'nullable', 'string', 'min:16', 'max:30'],
            'beneficiary_name' => ['required_if:send_mode,rib', 'nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $stats = $this->getFinancialStats();
        if ($validated['amount'] > $stats['live_balance']) {
            return back()->withErrors([
                'amount' => 'Insufficient balance. Available: ' . number_format($stats['live_balance'], 2) . ' MAD',
            ]);
        }

        $sender = Auth::user();
        $isRib = $validated['send_mode'] === 'rib';
        $recipient = null;

        if (!$isRib) {
            if ($validated['recipient_id'] == Auth::id()) {
                return back()->withErrors([
                    'recipient_id' => 'You cannot send money to yourself.',
                ]);
            }
            $recipient = User::find($validated['recipient_id']);
        }

        DB::transaction(function () use ($validated, $sender, $recipient, $isRib) {
            // Debit sender
            $merchantName = $isRib 
                ? 'Sent to ' . $validated['beneficiary_name'] . ' (RIB: ' . substr($validated['rib'], -4) . ')'
                : 'Sent to ' . $recipient->name;

            DB::table('transactions')->insert([
                'user_id' => $sender->id,
                'merchant' => $merchantName,
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

            if (!$isRib && $recipient) {
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
            }

            // Notify sender
            $recipientName = $isRib ? $validated['beneficiary_name'] : $recipient->name;
            $sender->notify(new \App\Notifications\SystemNotification([
                'type' => 'info',
                'title' => 'Money Sent',
                'message' => 'You sent ' . number_format($validated['amount'], 2) . ' MAD to ' . $recipientName,
                'action_type' => 'send',
                'user_name' => $sender->name,
            ]));
        });

        $recipientName = $isRib ? $validated['beneficiary_name'] : $recipient->name;
        return redirect()->route('send')->with('success', 'Sent ' . number_format($validated['amount'], 2) . ' MAD to ' . $recipientName);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReceiveMoneyController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();
        $userId = Auth::id();

        $recentReceives = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'credit')
            ->where('category', 'Received')
            ->orderBy('transacted_at', 'desc')
            ->take(config('oscorp.limits.receive_recent', 10))
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

        return Inertia::render('receive', [
            'recentReceives' => $recentReceives,
            'contacts' => $contacts,
        ]);
    }

    public function requestPayment(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'requester_id' => ['required', 'exists:users,id'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['requester_id'] == Auth::id()) {
            return back()->withErrors([
                'requester_id' => 'You cannot request money from yourself.',
            ]);
        }

        $user = Auth::user();
        $requester = User::find($validated['requester_id']);

        $requester->notify(new \App\Notifications\SystemNotification([
            'type' => 'warning',
            'title' => 'Payment Request',
            'message' => $user->name . ' requested ' . number_format($validated['amount'], 2) . ' MAD' . ($validated['note'] ? ' - ' . $validated['note'] : ''),
            'action_type' => 'request',
            'user_name' => $user->name,
        ]));

        return redirect()->route('receive')->with('success', 'Payment request sent to ' . $requester->name);
    }
}

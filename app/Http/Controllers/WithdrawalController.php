<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();

        $recentWithdrawals = DB::table('transactions')
            ->where('category', 'Withdrawal')
            ->orderBy('transacted_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('withdrawal', [
            'balance'           => round($stats['live_balance'], 2),
            'recentWithdrawals' => $recentWithdrawals,
        ]);
    }

    public function store(Request $request)
    {
        $stats = $this->getFinancialStats();
        $liveBalance = $stats['live_balance'];

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:500000'],
            'source' => ['required', 'in:Bank Transfer,Cash Pickup,Wire Transfer,External Account'],
            'note'   => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['amount'] > $liveBalance) {
            return back()->withErrors([
                'amount' => 'Insufficient funds. Available balance: ' . number_format($liveBalance, 2) . ' MAD',
            ]);
        }

        DB::table('transactions')->insert([
            'merchant'      => 'OSCORP Withdrawal',
            'type'          => 'debit',
            'category'      => 'Withdrawal',
            'amount'        => $validated['amount'],
            'source'        => $validated['source'],
            'note'          => $validated['note'] ?? null,
            'status'        => 'completed',
            'logo_color'    => '#EF4444',
            'transacted_at' => now(),
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        return redirect()->route('withdrawal')->with('success', 'Withdrawal of ' . number_format($validated['amount'], 2) . ' MAD initiated successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class DepositController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();

        $recentDeposits = DB::table('transactions')
            ->where('category', 'Deposit')
            ->orderBy('transacted_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('deposit', [
            'balance'        => round($stats['live_balance'], 2),
            'recentDeposits' => $recentDeposits,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:500000'],
            'source' => ['required', 'in:Bank Transfer,Cash Deposit,Wire Transfer,Cheque'],
            'note'   => ['nullable', 'string', 'max:500'],
        ]);

        DB::table('transactions')->insert([
            'merchant'      => 'OSCORP Deposit',
            'type'          => 'credit',
            'category'      => 'Deposit',
            'amount'        => $validated['amount'],
            'source'        => $validated['source'],
            'note'          => $validated['note'] ?? null,
            'status'        => 'completed',
            'logo_color'    => '#D4AF37',
            'transacted_at' => now(),
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        return redirect()->route('deposit')->with('success', 'Deposit of ' . number_format($validated['amount'], 2) . ' MAD confirmed successfully.');
    }
}

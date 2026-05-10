<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class AccountController extends Controller
{
    use HasOscorpBalance;

    public function cards()
    {
        $user = Auth::user();
        $stats = $this->getFinancialStats();
        
        $recentTransactions = DB::table('transactions')
            ->where('user_id', $user->id)
            ->orderBy('transacted_at', 'desc')
            ->take(config('oscorp.limits.contacts_recent', 5))
            ->get();

        $cardConfig = config('oscorp.card');
        $accountConfig = config('oscorp.account');
        $ribConfig = config('oscorp.rib');
        $cardLimit = $cardConfig['limit'];

        return Inertia::render('cards', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'tag' => $user->tag,
                'created_at' => $user->created_at->toIso8601String(),
                'email_verified' => !!$user->email_verified_at,
            ],
            'card' => [
                'number' => $cardConfig['last4'],
                'full_number' => '**** **** **** ' . $cardConfig['last4'],
                'holder' => strtoupper($user->name),
                'expiry' => $cardConfig['expiry'],
                'cvv' => '***',
                'type' => 'VISA Platinum',
                'limit' => $cardLimit,
                'available' => round($cardLimit - $stats['total_spending'], 2),
            ],
            'rib' => [
                'full' => $ribConfig['full'],
                'bank_code' => $ribConfig['bank_code'],
                'branch_code' => $ribConfig['branch_code'],
                'account_number' => $ribConfig['account_number'],
                'rib_key' => $ribConfig['rib_key'],
            ],
            'account' => [
                'number' => implode(' ', str_split($ribConfig['account_number'], 4)),
                'type' => $accountConfig['type'],
                'opened' => $user->created_at->format('d M Y'),
                'branch' => $accountConfig['branch'],
                'status' => 'Active',
            ],
            'stats' => [
                'total_credits' => round($stats['total_credits'], 2),
                'total_debits' => round($stats['total_debits'], 2),
                'transaction_count' => DB::table('transactions')->where('user_id', $user->id)->count(),
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }

    public function profile()
    {
        $user = Auth::user();
        $stats = $this->getFinancialStats();
        $preferences = $user->preferences ?? [];
        if (is_string($preferences)) {
            $preferences = json_decode($preferences, true) ?: [];
        }
        $currency = $preferences['currency'] ?? 'MAD';
        $currencies = config('currencies.currencies', []);

        return Inertia::render('account', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tag' => $user->tag,
                'phone' => $user->phone ?? 'Not provided',
                'avatar' => $user->avatar,
                'created_at' => $user->created_at->format('M Y'),
                'last_login' => $user->last_login_at ? \Carbon\Carbon::parse($user->last_login_at)->format('d M Y, H:i') : 'First login',
                'preferences' => $preferences,
                'job_title' => $user->job_title ?? 'Not provided',
                'address' => $user->address ?? 'Not provided',
                'cin' => $user->cin ?? 'Not provided',
                'date_of_birth' => $user->date_of_birth ? \Carbon\Carbon::parse($user->date_of_birth)->format('d M Y') : 'Not provided',
                'place_of_birth' => $user->place_of_birth ?? 'Not provided',
                'nationality' => $user->nationality ?? 'Not provided',
                'gender' => $user->gender ? ucfirst($user->gender) : 'Not provided',
            ],
            'security' => [
                'two_factor_enabled' => !!$user->two_factor_secret,
                'email_verified' => !!$user->email_verified_at,
            ],
            'financial' => [
                'total_spending' => round($stats['total_spending'], 2),
                'total_received' => round($stats['total_credits'], 2),
            ],
            'currency' => $currency,
            'currencies' => $currencies,
        ]);
    }

    public function updateCurrency(Request $request)
    {
        $validated = $request->validate([
            'currency' => ['required', 'string', Rule::in(array_keys(config('currencies.currencies', ['MAD' => []])))],
        ]);

        $user = Auth::user();
        $preferences = $user->preferences ?? [];
        if (is_string($preferences)) {
            $preferences = json_decode($preferences, true) ?: [];
        }

        $preferences['currency'] = $validated['currency'];
        $user->preferences = $preferences;
        $user->save();

        return redirect()->back()->with('success', 'Currency updated to ' . $validated['currency'] . '.');
    }
}

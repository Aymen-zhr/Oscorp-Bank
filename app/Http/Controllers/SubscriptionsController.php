<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Notification;
use App\Traits\HasOscorpBalance;

class SubscriptionsController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $userId = Auth::id();
        $stats = $this->getFinancialStats();

        // Find recurring subscription transactions from the database
        $recurringMerchants = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->select('merchant', 'category', DB::raw('AVG(amount) as avg_amount'), DB::raw('COUNT(*) as count'))
            ->groupBy('merchant', 'category')
            ->having('count', '>=', 2)
            ->orderBy('avg_amount', 'desc')
            ->get();

        $domainMap = config('subscriptions.domain_map', [
            'Netflix' => 'netflix.com', 'Spotify' => 'spotify.com', 'Amazon' => 'amazon.com',
            'Adobe' => 'adobe.com', 'GitHub' => 'github.com', 'ChatGPT' => 'openai.com',
            'Apple' => 'apple.com', 'Google' => 'google.com', 'YouTube' => 'youtube.com',
            'Zoom' => 'zoom.us', 'Slack' => 'slack.com', 'Steam' => 'steampowered.com',
            'Airbnb' => 'airbnb.com', 'Uber' => 'uber.com', 'Inwi' => 'inwi.ma',
            'Orange' => 'orange.ma', 'Maroc Telecom' => 'iam.ma',
        ]);

        $activeSubscriptions = [];
        $subId = 1;

        // Use known subscriptions for showcase, but calculate prices from real transactions if available
        $knownSubs = config('subscriptions.demo_subscriptions', []);

        foreach ($knownSubs as $sub) {
            // Check if we have real transaction data for this merchant
            $realTx = $recurringMerchants->first(function($tx) use ($sub) {
                return stripos($tx->merchant, explode(' ', $sub['name'])[0]) !== false;
            });

            $price = $realTx ? round($realTx->avg_amount, 2) : $sub['price'];

            $activeSubscriptions[] = [
                'id' => 'SUB-' . str_pad($subId++, 3, '0', STR_PAD_LEFT),
                'name' => $sub['name'],
                'domain' => $sub['domain'],
                'plan' => $sub['plan'],
                'price' => $price,
                'status' => $sub['status'] ?? 'Active',
                'billingCycle' => $sub['billingCycle'],
                'nextBilling' => isset($sub['monthsAhead'])
                    ? Carbon::now()->addMonths($sub['monthsAhead'])->format(config('oscorp.date_formats.default', 'Y-m-d'))
                    : Carbon::now()->addDays($sub['daysOffset'])->format(config('oscorp.date_formats.default', 'Y-m-d')),
                'startedAt' => Carbon::now()->subMonths($sub['monthsAgo'])->format(config('oscorp.date_formats.default', 'Y-m-d')),
            ];
        }

        // Generate billing history from real transactions
        $billingHistory = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('type', 'debit')
            ->where('transacted_at', '>=', Carbon::now()->subMonths(config('subscriptions.billing_history_months', 3)))
            ->orderBy('transacted_at', 'desc')
            ->limit(config('oscorp.limits.subscription_history', 15))
            ->get()
            ->map(function($tx) use ($domainMap) {
                $domain = null;
                foreach ($domainMap as $name => $d) {
                    if (stripos($tx->merchant, $name) !== false) {
                        $domain = $d;
                        break;
                    }
                }
                return [
                    'id' => 'INV-' . str_pad($tx->id ?? rand(10000, 99999), 5, '0', STR_PAD_LEFT),
                    'description' => $tx->merchant,
                    'domain' => $domain,
                    'amount' => round($tx->amount, 2),
                    'status' => 'Paid',
                    'date' => Carbon::parse($tx->transacted_at)->format(config('oscorp.date_formats.default', 'Y-m-d')),
                ];
            })->toArray();

        // Apply session-stored paused states
        $pausedIds = session('paused_subscriptions', []);
        $activeSubscriptions = array_map(function ($sub) use ($pausedIds) {
            if (in_array($sub['id'], $pausedIds)) {
                $sub['status'] = 'Paused';
            }
            return $sub;
        }, $activeSubscriptions);

        // Calculate stats
        $activeCount = count(array_filter($activeSubscriptions, fn($s) => $s['status'] === 'Active'));
        $monthlyTotal = collect($activeSubscriptions)
            ->filter(fn($s) => $s['status'] === 'Active' && $s['billingCycle'] === 'Monthly')
            ->sum('price');

        $yearlyTotal = collect($activeSubscriptions)
            ->filter(fn($s) => $s['status'] === 'Active' && $s['billingCycle'] === 'Yearly')
            ->sum('price');

        $estimatedMonthly = $monthlyTotal + ($yearlyTotal / 12);

        return Inertia::render('subscriptions', [
            'subscriptions' => $activeSubscriptions,
            'billingHistory' => $billingHistory,
            'stats' => [
                'activeCount' => $activeCount,
                'monthlySpend' => round($estimatedMonthly, 2),
                'yearlySpend' => round($estimatedMonthly * 12, 2),
            ]
        ]);
    }

    public function pause($id, Request $request)
    {
        $userId = Auth::id();
        $name = $request->input('name', "Subscription {$id}");

        $pausedIds = session('paused_subscriptions', []);
        if (!in_array($id, $pausedIds)) {
            $pausedIds[] = $id;
            session(['paused_subscriptions' => $pausedIds]);
        }

        Notification::create([
            'id' => (string) Str::uuid(),
            'type' => 'subscription_paused',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => $userId,
            'data' => [
                'type' => 'info',
                'title' => 'Subscription Paused',
                'message' => "{$name} has been paused. You will not be charged for this cycle.",
            ],
        ]);

        return redirect()->back()->with('success', "{$name} paused successfully.");
    }

    public function resume($id, Request $request)
    {
        $userId = Auth::id();
        $name = $request->input('name', "Subscription {$id}");

        $pausedIds = session('paused_subscriptions', []);
        $pausedIds = array_values(array_filter($pausedIds, fn($pausedId) => $pausedId !== $id));
        session(['paused_subscriptions' => $pausedIds]);

        Notification::create([
            'id' => (string) Str::uuid(),
            'type' => 'subscription_resumed',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => $userId,
            'data' => [
                'type' => 'success',
                'title' => 'Subscription Resumed',
                'message' => "{$name} has been resumed. Your next billing will proceed as normal.",
            ],
        ]);

        return redirect()->back()->with('success', "{$name} resumed successfully.");
    }
}

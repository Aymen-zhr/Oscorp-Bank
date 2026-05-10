<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $perPage = config('oscorp.limits.pagination', 20);
        $dateFormat = config('oscorp.admin.date_format_short', 'd M Y');
        $activeDays = config('oscorp.limits.new_accounts_days', 7);

        $query = User::query();

        if ($request->filled('status')) {
            if ($request->status === 'user') {
                $query->where('is_admin', false);
            } elseif ($request->status === 'admin') {
                $query->where('is_admin', true);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%");
            });
        }

        $accounts = $query->withCount(['loans', 'transactions'])->paginate($perPage);

        $accounts->getCollection()->transform(function ($account) use ($dateFormat) {
            $account->created_at = $account->created_at->format($dateFormat);
            return $account;
        });

        $stats = [
            'total_accounts' => User::count(),
            'admin_accounts' => User::where('is_admin', true)->count(),
            'user_accounts' => User::where('is_admin', false)->count(),
            'new_this_week' => User::where('created_at', '>', now()->subDays($activeDays))->count(),
        ];

        return Inertia::render('admin/accounts', [
            'accounts' => $accounts,
            'stats' => $stats,
            'filters' => $request->only('status', 'search'),
        ]);
    }

    public function toggleStatus(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Cannot disable your own account.');
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return redirect()->back()->with('success', 'Account status updated.');
    }
}

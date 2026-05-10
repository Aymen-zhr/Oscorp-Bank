<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $recentLimit = config('oscorp.limits.admin_recent_users', 5);
        $loanRecentLimit = config('oscorp.limits.admin_recent_loans', 5);
        $dateFormat = config('oscorp.admin.date_format_short', 'd M Y');

        $stats = [
            'total_users' => User::count(),
            'total_loans_pending' => Loan::where('status', Loan::STATUS_PENDING)->count(),
            'total_loans_active' => Loan::where('status', Loan::STATUS_ACTIVE)->count(),
            'total_loan_amount' => Loan::where('status', Loan::STATUS_ACTIVE)->sum('amount'),
            'recent_users' => User::latest()->take($recentLimit)->get()->map(function ($u) use ($dateFormat) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'tag' => $u->tag,
                    'phone' => $u->phone,
                    'cin' => $u->cin,
                    'created_at' => $u->created_at->format($dateFormat),
                ];
            }),
            'recent_loans' => Loan::with('user')->latest()->take($loanRecentLimit)->get()->map(function ($l) use ($dateFormat) {
                return [
                    'id' => $l->id,
                    'user_name' => $l->user->name,
                    'type' => $l->type,
                    'amount' => $l->amount,
                    'status' => $l->status,
                    'created_at' => $l->created_at->format($dateFormat),
                ];
            }),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users(Request $request)
    {
        $perPage = config('oscorp.limits.pagination', 20);
        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function showUser(User $user)
    {
        $dateFormat = config('oscorp.admin.date_format_long', 'd M Y, H:i');

        $user->load(['loans' => function ($q) {
            $q->latest();
        }]);

        return Inertia::render('admin/user-detail', [
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tag' => $user->tag,
                'phone' => $user->phone,
                'job_title' => $user->job_title,
                'address' => $user->address,
                'cin' => $user->cin,
                'date_of_birth' => $user->date_of_birth,
                'place_of_birth' => $user->place_of_birth,
                'nationality' => $user->nationality,
                'gender' => $user->gender,
                'is_admin' => $user->is_admin,
                'created_at' => $user->created_at->format($dateFormat),
                'loans' => $user->loans->map(function ($loan) use ($dateFormat) {
                    return [
                        'id' => $loan->id,
                        'type' => $loan->type,
                        'amount' => $loan->amount,
                        'rate' => $loan->rate,
                        'term_months' => $loan->term_months,
                        'status' => $loan->status,
                        'created_at' => $loan->created_at->format($dateFormat),
                    ];
                }),
            ],
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'job_title' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'cin' => 'nullable|string|max:20|unique:users,cin,' . $user->id,
            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:50',
            'gender' => 'nullable|in:male,female',
            'is_admin' => 'boolean',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function toggleAdmin(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'Cannot change your own admin status.');
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return redirect()->back()->with('success', 'User admin status updated.');
    }
}

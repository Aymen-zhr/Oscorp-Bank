<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $perPage = config('oscorp.limits.pagination', 20);
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $currency = config('oscorp.currency', 'MAD');

        $user = null;
        $loans = null;
        $stats = [];

        if ($request->filled('user_id')) {
            $user = User::find($request->user_id);
        }

        if ($user) {
            $query = Loan::with('user')->where('user_id', $user->id)->latest();

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('type', 'like', "%{$search}%");
            }

            $loans = $query->paginate($perPage);

            $stats = [
                'pending' => Loan::where('user_id', $user->id)->where('status', Loan::STATUS_PENDING)->count(),
                'approved' => Loan::where('user_id', $user->id)->whereIn('status', [Loan::STATUS_APPROVED, Loan::STATUS_ACTIVE])->count(),
                'rejected' => Loan::where('user_id', $user->id)->where('status', Loan::STATUS_REJECTED)->count(),
                'total_active' => Loan::where('user_id', $user->id)->where('status', Loan::STATUS_ACTIVE)->sum('amount'),
                'currency' => $currency,
            ];
        } else {
            $stats = [
                'pending' => 0,
                'approved' => 0,
                'rejected' => 0,
                'total_active' => 0,
                'currency' => $currency,
            ];
        }

        return Inertia::render('admin/loans', [
            'loans' => $loans,
            'stats' => $stats,
            'filters' => $request->only('user_id', 'status', 'search'),
            'selectedUser' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'tag' => $user->tag,
                'count' => Loan::where('user_id', $user->id)->count(),
            ] : null,
        ]);
    }

    public function searchUsers(Request $request)
    {
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $search = $request->query('q', '');

        $users = User::withCount('loans')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%");
            })
            ->select('id', 'name', 'email', 'tag')
            ->limit($searchLimit)
            ->get();

        return response()->json($users);
    }

    public function approve(Loan $loan)
    {
        $loan->update([
            'status' => Loan::STATUS_ACTIVE,
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Loan approved successfully.');
    }

    public function reject(Request $request, Loan $loan)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $loan->update([
            'status' => Loan::STATUS_REJECTED,
            'rejected_at' => now(),
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Loan rejected.');
    }

    public function show(Loan $loan)
    {
        $dateFormat = config('oscorp.admin.date_format_long', 'd M Y, H:i');

        $loan->load(['user', 'approvedBy']);

        return Inertia::render('admin/loan-detail', [
            'loan' => [
                'id' => $loan->id,
                'type' => $loan->type,
                'amount' => $loan->amount,
                'rate' => $loan->rate,
                'term_months' => $loan->term_months,
                'monthly_payment' => $loan->monthly_payment,
                'total_repayment' => $loan->total_repayment,
                'status' => $loan->status,
                'purpose' => $loan->purpose,
                'admin_notes' => $loan->admin_notes,
                'approved_at' => $loan->approved_at?->format($dateFormat),
                'rejected_at' => $loan->rejected_at?->format($dateFormat),
                'approved_by_name' => $loan->approvedBy?->name,
                'created_at' => $loan->created_at->format($dateFormat),
                'user' => [
                    'id' => $loan->user->id,
                    'name' => $loan->user->name,
                    'email' => $loan->user->email,
                    'tag' => $loan->user->tag,
                    'phone' => $loan->user->phone,
                    'cin' => $loan->user->cin,
                ],
            ],
        ]);
    }
}

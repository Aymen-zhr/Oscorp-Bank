<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BillSplitController extends Controller
{
    public function index(Request $request)
    {
        $perPage = config('oscorp.limits.pagination', 20);
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $dateFormat = config('oscorp.admin.date_format_short', 'd M Y');
        $currency = config('oscorp.currency', 'MAD');

        $user = null;
        $bills = null;
        $stats = [];

        if ($request->filled('user_id')) {
            $user = User::find($request->user_id);
        }

        if ($user) {
            $query = DB::table('bill_splits')->where('creator_id', $user->id)->orderBy('created_at', 'desc');

            if ($request->filled('status')) {
                $query->where('bill_splits.status', $request->status);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where('bill_splits.title', 'like', "%{$search}%");
            }

            $bills = $query->paginate($perPage);

            $bills->getCollection()->transform(function ($bill) use ($dateFormat) {
                $bill->created_at = \Carbon\Carbon::parse($bill->created_at)->format($dateFormat);
                return $bill;
            });

            $stats = [
                'total_bills' => DB::table('bill_splits')->where('creator_id', $user->id)->count(),
                'active_bills' => DB::table('bill_splits')->where('creator_id', $user->id)->where('status', 'active')->count(),
                'completed_bills' => DB::table('bill_splits')->where('creator_id', $user->id)->where('status', 'paid')->count(),
                'total_value' => DB::table('bill_splits')->where('creator_id', $user->id)->sum('total_amount'),
                'currency' => $currency,
            ];
        } else {
            $stats = [
                'total_bills' => 0,
                'active_bills' => 0,
                'completed_bills' => 0,
                'total_value' => 0,
                'currency' => $currency,
            ];
        }

        return Inertia::render('admin/bill-splits', [
            'bills' => $bills,
            'stats' => $stats,
            'filters' => $request->only('user_id', 'status', 'search'),
            'selectedUser' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'tag' => $user->tag,
                'count' => DB::table('bill_splits')->where('creator_id', $user->id)->count(),
            ] : null,
        ]);
    }

    public function searchUsers(Request $request)
    {
        $searchLimit = config('oscorp.limits.admin_search_limit', 10);
        $search = $request->query('q', '');

        $users = User::where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('tag', 'like', "%{$search}%");
            })
            ->select('id', 'name', 'email', 'tag')
            ->limit($searchLimit)
            ->get()
            ->map(function ($user) {
                $user->bill_count = DB::table('bill_splits')
                    ->where('creator_id', $user->id)
                    ->count();
                return $user;
            });

        return response()->json($users);
    }

    public function destroy($id)
    {
        DB::table('bill_participants')->where('bill_split_id', $id)->delete();
        DB::table('bill_splits')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'Bill split deleted.');
    }
}

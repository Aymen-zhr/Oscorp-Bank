<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactController extends Controller
{
    use \App\Traits\HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();

        $contacts = Contact::where('user_id', Auth::id())
            ->with('contactUser:id,name,email,avatar')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($contact) => [
                'id' => $contact->id,
                'user_id' => $contact->contact_user_id,
                'name' => $contact->nickname ?? $contact->contactUser->name,
                'email' => $contact->contactUser->email,
                'avatar' => $contact->contactUser->avatar,
                'avatar_color' => $contact->avatar_color,
                'nickname' => $contact->nickname,
                'created_at' => $contact->created_at,
            ]);

        $recentSplits = \Illuminate\Support\Facades\DB::table('bill_splits')
            ->join('bill_participants', 'bill_splits.id', '=', 'bill_participants.bill_split_id')
            ->where('bill_splits.creator_id', Auth::id())
            ->whereNotNull('bill_participants.user_id')
            ->select('bill_participants.user_id', \Illuminate\Support\Facades\DB::raw('COUNT(*) as split_count'))
            ->groupBy('bill_participants.user_id')
            ->orderByDesc('split_count')
            ->limit(5)
            ->get();

        return Inertia::render('contacts', [
            'balance' => round($stats['live_balance'], 2),
            'contacts' => $contacts,
            'contactStats' => [
                'total' => $contacts->count(),
                'recent_splits' => $recentSplits,
            ],
        ]);
    }

    public function index()
    {
        $contacts = Contact::where('user_id', Auth::id())
            ->with('contactUser:id,name,email,avatar')
            ->get()
            ->map(fn($contact) => [
                'id' => $contact->contact_user_id,
                'name' => $contact->nickname ?? $contact->contactUser->name,
                'email' => $contact->contactUser->email,
                'avatar' => $contact->contactUser->avatar,
                'avatar_color' => $contact->avatar_color,
                'nickname' => $contact->nickname,
            ]);

        return response()->json($contacts);
    }

    public function search(Request $request)
    {
        $query = $request->input('q', '');

        if (empty($query)) {
            return response()->json([]);
        }

        $existingContactIds = Contact::where('user_id', Auth::id())
            ->pluck('contact_user_id')
            ->toArray();

        $users = User::where('id', '!=', Auth::id())
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(20)
            ->get(['id', 'name', 'email', 'avatar'])
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'is_contact' => in_array($user->id, $existingContactIds),
            ]);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact_user_id' => ['required', 'exists:users,id'],
            'nickname' => ['nullable', 'string', 'max:100'],
            'avatar_color' => ['nullable', 'string', 'max:50'],
        ]);

        $contact = Contact::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'contact_user_id' => $validated['contact_user_id'],
            ],
            [
                'nickname' => $validated['nickname'] ?? null,
                'avatar_color' => $validated['avatar_color'] ?? '#64748B',
            ]
        );

        return response()->json([
            'success' => true,
            'contact' => $contact,
        ]);
    }

    public function destroy(Contact $contact)
    {
        if ($contact->user_id !== Auth::id()) {
            abort(403);
        }

        $contact->delete();

        return response()->json(['success' => true]);
    }
}

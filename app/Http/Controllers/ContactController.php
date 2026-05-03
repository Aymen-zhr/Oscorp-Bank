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

        // Only show accepted contacts in the main list
        $contacts = Contact::where('user_id', Auth::id())
            ->where('status', 'accepted')
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

        // Incoming pending requests
        $pendingRequests = Contact::where('contact_user_id', Auth::id())
            ->where('status', 'pending')
            ->with('user:id,name,email,avatar')
            ->get()
            ->map(fn($contact) => [
                'id' => $contact->id,
                'user_id' => $contact->user_id,
                'name' => $contact->user->name,
                'email' => $contact->user->email,
                'avatar' => $contact->user->avatar,
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
            'pendingRequests' => $pendingRequests,
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

        if ($validated['contact_user_id'] == Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Cannot add yourself.']);
        }

        $contact = Contact::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'contact_user_id' => $validated['contact_user_id'],
            ],
            [
                'nickname' => $validated['nickname'] ?? null,
                'avatar_color' => $validated['avatar_color'] ?? '#64748B',
                'status' => 'pending',
            ]
        );

        // Send notification to the target user
        $targetUser = User::find($validated['contact_user_id']);
        $targetUser->notify(new \App\Notifications\SystemNotification([
            'type' => 'info',
            'title' => 'Contact Request',
            'message' => Auth::user()->name . ' wants to add you as a contact.',
            'action_type' => 'contact_request',
            'contact_id' => $contact->id,
            'user_name' => Auth::user()->name,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Request sent successfully.',
            'contact' => $contact,
        ]);
    }

    public function acceptRequest($id)
    {
        $contact = Contact::where('id', $id)
            ->where('contact_user_id', Auth::id())
            ->firstOrFail();

        $contact->update(['status' => 'accepted']);

        // Create reciprocal contact
        Contact::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'contact_user_id' => $contact->user_id,
            ],
            [
                'status' => 'accepted',
                'avatar_color' => '#64748B',
            ]
        );

        // Notify the requester
        $contact->user->notify(new \App\Notifications\SystemNotification([
            'type' => 'success',
            'title' => 'Request Accepted',
            'message' => Auth::user()->name . ' accepted your contact request.',
        ]));

        return back()->with('success', 'Contact request accepted.');
    }

    public function denyRequest($id)
    {
        $contact = Contact::where('id', $id)
            ->where('contact_user_id', Auth::id())
            ->firstOrFail();

        $contact->delete(); // Or set to 'declined'

        return back()->with('info', 'Contact request denied.');
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

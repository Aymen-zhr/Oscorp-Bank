<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class BillSplitController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $stats = $this->getFinancialStats();
        $currentUserId = Auth::id();

        $splits = DB::table('bill_splits')
            ->where(function($query) use ($currentUserId) {
                $query->where('creator_id', $currentUserId)
                    ->orWhereIn('id', function($q) use ($currentUserId) {
                        $q->select('bill_split_id')
                            ->from('bill_participants')
                            ->where('user_id', $currentUserId);
                    });
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($split) use ($currentUserId) {
                $participants = DB::table('bill_participants')
                    ->leftJoin('users', 'bill_participants.user_id', '=', 'users.id')
                    ->select(
                        'bill_participants.*',
                        'users.name as user_name',
                        'users.email as user_email',
                        'users.avatar as user_avatar'
                    )
                    ->where('bill_split_id', $split->id)
                    ->orderByRaw('CASE WHEN user_id = ? THEN 0 ELSE 1 END', [$currentUserId])
                    ->orderBy('has_paid')
                    ->get();

                // Compute values dynamically for the current viewer
                $myParticipant = $participants->firstWhere('user_id', $currentUserId);
                $myShare = $myParticipant ? (float) $myParticipant->share_amount : 0;
                $myHasPaid = $myParticipant ? (bool) $myParticipant->has_paid : true;
                $youOwe = !$myHasPaid;

                return [
                    ... (array) $split,
                    'your_share' => $myShare,
                    'you_owe' => $youOwe,
                    'participants' => $participants,
                    'participant_count' => $participants->count(),
                ];
            });

        $summary = [
            'total_you_owe' => $splits->filter(fn($s) => $s['you_owe'] && $s['status'] === 'active')->sum('your_share'),
            'total_owed_to_you' => $splits->filter(fn($s) => !$s['you_owe'] && $s['status'] === 'active')->sum('your_share'),
            'active_count' => $splits->filter(fn($s) => $s['status'] === 'active')->count(),
            'active_total' => $splits->filter(fn($s) => $s['status'] === 'active')->sum('total_amount'),
            'pending_count' => $splits->filter(fn($s) => $s['status'] === 'pending')->count(),
            'pending_total' => $splits->filter(fn($s) => $s['status'] === 'pending')->sum('total_amount'),
            'declined_count' => $splits->filter(fn($s) => $s['status'] === 'declined')->count(),
            'declined_total' => $splits->filter(fn($s) => $s['status'] === 'declined')->sum('total_amount'),
            'paid_count' => $splits->filter(fn($s) => $s['status'] === 'paid')->count(),
        ];

        $contacts = DB::table('contacts')
            ->join('users', 'contacts.contact_user_id', '=', 'users.id')
            ->where('contacts.user_id', Auth::id())
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.avatar',
                'contacts.nickname',
                'contacts.avatar_color'
            )
            ->get()
            ->map(fn($contact) => [
                'id' => $contact->id,
                'name' => $contact->nickname ?? $contact->name,
                'email' => $contact->email,
                'avatar' => $contact->avatar,
                'avatar_color' => $contact->avatar_color,
            ]);

        $suggestedBills = [
            [
                'title' => 'Netflix Family Plan',
                'description' => '4-person family sharing',
                'icon' => 'tv',
                'color' => '#E50914',
                'typical_amount' => 149,
                'participants' => 4,
            ],
            [
                'title' => 'Spotify Family',
                'description' => 'Up to 6 accounts',
                'icon' => 'music',
                'color' => '#1DB954',
                'typical_amount' => 119,
                'participants' => 6,
            ],
            [
                'title' => 'Xbox Game Pass Ultimate',
                'description' => 'Game sharing group',
                'icon' => 'gamepad-2',
                'color' => '#107C10',
                'typical_amount' => 169,
                'participants' => 5,
            ],
            [
                'title' => 'Adobe Creative Cloud',
                'description' => 'Team subscription split',
                'icon' => 'palette',
                'color' => '#FF0000',
                'typical_amount' => 549,
                'participants' => 3,
            ],
            [
                'title' => 'Dinner at Restaurant',
                'description' => 'Split the bill evenly',
                'icon' => 'utensils',
                'color' => '#F59E0B',
                'typical_amount' => 500,
                'participants' => 4,
            ],
            [
                'title' => 'Internet Bill (WiFi)',
                'description' => 'Shared household internet',
                'icon' => 'wifi',
                'color' => '#3B82F6',
                'typical_amount' => 299,
                'participants' => 3,
            ],
        ];

        return Inertia::render('split-bills', [
            'userId' => $currentUserId,
            'splits' => $splits,
            'summary' => $summary,
            'suggestedBills' => $suggestedBills,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'total_amount' => ['required', 'numeric', 'min:0.01', 'max:' . config('oscorp.limits.max_transfer', 100000)],
            'icon' => ['nullable', 'string', 'max:50'],
            'logo_color' => ['nullable', 'string', 'max:50'],
            'split_type' => ['required', 'in:equal,custom'],
            'due_date' => ['nullable', 'date'],
            'is_recurring' => ['boolean'],
            'recurring_period' => ['nullable', 'in:weekly,monthly,yearly'],
            'participants' => ['required', 'array', 'min:2'],
            'participants.*.name' => ['required', 'string', 'max:100'],
            'participants.*.user_id' => ['nullable', 'exists:users,id'],
            'participants.*.phone_number' => ['nullable', 'string', 'max:20'],
            'participants.*.tag' => ['nullable', 'string', 'max:50'],
            'participants.*.avatar_color' => ['nullable', 'string', 'max:50'],
            'participants.*.share_amount' => ['nullable', 'numeric', 'min:0'],
            'participants.*.is_you' => ['boolean'],
            'participants.*.has_paid' => ['boolean'],
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($validated, $user) {
            $totalAmount = (float) $validated['total_amount'];
            $participantCount = count($validated['participants']);

            if ($validated['split_type'] === 'equal') {
                $sharePerPerson = round($totalAmount / $participantCount, 2);

                $yourShare = 0;
                foreach ($validated['participants'] as $p) {
                    if (!empty($p['is_you'])) {
                        $yourShare = $sharePerPerson;
                        break;
                    }
                }
            } else {
                $yourShare = 0;
                foreach ($validated['participants'] as $p) {
                    if (!empty($p['is_you'])) {
                        $yourShare = (float) ($p['share_amount'] ?? 0);
                        break;
                    }
                }
            }

            $youOwe = true;
            foreach ($validated['participants'] as $p) {
                if (!empty($p['is_you'])) {
                    $youOwe = !(bool) ($p['has_paid'] ?? false);
                    break;
                }
            }

            $colors = ['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

            $billSplitId = DB::table('bill_splits')->insertGetId([
                'creator_id' => $user->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'total_amount' => $totalAmount,
                'icon' => $validated['icon'] ?? 'receipt',
                'logo_color' => $validated['logo_color'] ?? $colors[array_rand($colors)],
                'status' => 'pending',
                'split_type' => $validated['split_type'],
                'your_share' => $yourShare,
                'you_owe' => $youOwe,
                'due_date' => $validated['due_date'] ?? null,
                'is_recurring' => $validated['is_recurring'] ?? false,
                'recurring_period' => $validated['is_recurring'] ? ($validated['recurring_period'] ?? 'monthly') : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($validated['participants'] as $index => $p) {
                if ($validated['split_type'] === 'equal') {
                    $sharePerPerson = round($totalAmount / $participantCount, 2);
                    if ($index === $participantCount - 1) {
                        $sumOfOthers = $sharePerPerson * ($participantCount - 1);
                        $shareAmount = round($totalAmount - $sumOfOthers, 2);
                    } else {
                        $shareAmount = $sharePerPerson;
                    }
                } else {
                    $shareAmount = (float) ($p['share_amount'] ?? 0);
                }

                DB::table('bill_participants')->insert([
                    'bill_split_id' => $billSplitId,
                    'user_id' => !empty($p['is_you']) ? $user->id : (!empty($p['user_id']) ? $p['user_id'] : null),
                    'name' => $p['name'],
                    'phone_number' => $p['phone_number'] ?? null,
                    'tag' => $p['tag'] ?? null,
                    'acceptance_status' => !empty($p['is_you']) ? 'accepted' : 'pending',
                    'avatar_color' => $p['avatar_color'] ?? $colors[array_rand($colors)],
                    'share_amount' => $shareAmount,
                    'is_you' => !empty($p['is_you']),
                    'has_paid' => !empty($p['has_paid']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        return redirect()->route('split-bills')->with('success', 'Split bill "' . $validated['title'] . '" created successfully.');
    }

    public function markPaid(Request $request, $id)
    {
        $validated = $request->validate([
            'partial_amount' => ['nullable', 'numeric', 'min:0.01'],
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($id, $validated, $userId) {
            $split = DB::table('bill_splits')->find($id);
            if (!$split || $split->status !== 'active') {
                return;
            }

            $participant = DB::table('bill_participants')
                ->where('bill_split_id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$participant) {
                return;
            }

            $paymentAmount = $validated['partial_amount'] ?? $participant->share_amount;
            $isPartial = isset($validated['partial_amount']);

            if (!$isPartial) {
                $unpaidCount = DB::table('bill_participants')
                    ->where('bill_split_id', $id)
                    ->where('has_paid', false)
                    ->where('id', '!=', $participant->id)
                    ->count();

                if ($unpaidCount === 0) {
                    DB::table('bill_splits')
                        ->where('id', $id)
                        ->update([
                            'status' => 'paid',
                            'updated_at' => now(),
                        ]);
                }
            }

            DB::table('bill_participants')
                ->where('id', $participant->id)
                ->update([
                    'has_paid' => !$isPartial,
                    'partial_paid' => $isPartial ? $paymentAmount : $participant->share_amount,
                    'updated_at' => now(),
                ]);

            $user = Auth::user();
            if ($user) {
                DB::table('notifications')->insert([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\Notifications\SystemNotification',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'title' => $isPartial ? 'Partial Payment' : 'Bill Paid',
                        'message' => ($isPartial ? 'You paid MAD ' . number_format($paymentAmount, 2) . ' towards "' : 'You paid your share of "') . $split->title . '"',
                        'type' => 'bill_paid',
                        'amount' => $paymentAmount,
                        'icon' => 'credit',
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('transactions')->insert([
                    'user_id' => $user->id,
                    'merchant' => $split->title,
                    'type' => 'debit',
                    'category' => 'Bill Split',
                    'amount' => $paymentAmount,
                    'status' => 'completed',
                    'logo_color' => $split->logo_color,
                    'transacted_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        return redirect()->route('split-bills')->with('success', $validated['partial_amount'] ? 'Partial payment recorded.' : 'Payment recorded successfully.');
    }

    public function respond(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:accepted,declined'],
        ]);

        DB::transaction(function () use ($id, $validated) {
            $participant = DB::table('bill_participants')
                ->where('bill_split_id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if ($participant) {
                DB::table('bill_participants')
                    ->where('id', $participant->id)
                    ->update(['acceptance_status' => $validated['status'], 'updated_at' => now()]);

                // Check if everyone has accepted
                $pendingCount = DB::table('bill_participants')
                    ->where('bill_split_id', $id)
                    ->where('acceptance_status', 'pending')
                    ->count();

                if ($pendingCount === 0) {
                    $hasDecline = DB::table('bill_participants')
                        ->where('bill_split_id', $id)
                        ->where('acceptance_status', 'declined')
                        ->exists();

                    DB::table('bill_splits')
                        ->where('id', $id)
                        ->update([
                            'status' => $hasDecline ? 'declined' : 'active',
                            'updated_at' => now()
                        ]);
                }
            }
        });

        return redirect()->route('split-bills')->with('success', 'Response recorded.');
    }

    public function delete($id)
    {
        $userId = Auth::id();

        $split = DB::table('bill_splits')->where('id', $id)->where('creator_id', $userId)->first();
        if (!$split) {
            return redirect()->route('split-bills')->with('error', 'You can only delete splits you created.');
        }

        DB::table('bill_participants')->where('bill_split_id', $id)->delete();
        DB::table('bill_splits')->where('id', $id)->delete();

        return redirect()->route('split-bills')->with('success', 'Split bill removed.');
    }

    public function settle($id)
    {
        $userId = Auth::id();

        $split = DB::table('bill_splits')->where('id', $id)->first();
        if (!$split) {
            return redirect()->route('split-bills')->with('error', 'Split bill not found.');
        }

        $isOwner = DB::table('bill_splits')->where('id', $id)->where('creator_id', $userId)->exists();
        $isParticipant = DB::table('bill_participants')->where('bill_split_id', $id)->where('user_id', $userId)->exists();

        if (!$isOwner && !$isParticipant) {
            return redirect()->route('split-bills')->with('error', 'You do not have access to this split bill.');
        }

        $unpaidCount = DB::table('bill_participants')
            ->where('bill_split_id', $id)
            ->where('has_paid', false)
            ->count();

        if ($unpaidCount > 0) {
            return redirect()->route('split-bills')->with('error', $unpaidCount . ' participant(s) still owe their share.');
        }

        DB::table('bill_splits')
            ->where('id', $id)
            ->where('status', 'active')
            ->update(['status' => 'paid', 'updated_at' => now()]);

        return redirect()->route('split-bills')->with('success', 'Bill settled successfully.');
    }

    public function remind($id)
    {
        $userId = Auth::id();

        $split = DB::table('bill_splits')->where('id', $id)->first();
        if (!$split) {
            return redirect()->route('split-bills')->with('error', 'Split bill not found.');
        }

        $isOwner = DB::table('bill_splits')->where('id', $id)->where('creator_id', $userId)->exists();
        if (!$isOwner) {
            return redirect()->route('split-bills')->with('error', 'Only the creator can send reminders.');
        }

        $unpaidParticipants = DB::table('bill_participants')
            ->where('bill_split_id', $id)
            ->where('is_you', false)
            ->where('has_paid', false)
            ->get();

        foreach ($unpaidParticipants as $participant) {
            if ($participant->user_id) {
                DB::table('notifications')->insert([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\Notifications\SystemNotification',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $participant->user_id,
                    'data' => json_encode([
                        'title' => 'Payment Reminder',
                        'message' => 'You have an unpaid share of "' . $split->title . '" (MAD ' . number_format($participant->share_amount, 2) . ')',
                        'type' => 'payment_reminder',
                        'amount' => $participant->share_amount,
                        'icon' => 'bell',
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return redirect()->route('split-bills')->with('success', 'Reminders sent to ' . $unpaidParticipants->count() . ' participant(s).');
    }

    public function export()
    {
        $userId = Auth::id();

        $splitIds = DB::table('bill_splits')
            ->where(function($query) use ($userId) {
                $query->where('creator_id', $userId)
                    ->orWhereIn('id', function($q) use ($userId) {
                        $q->select('bill_split_id')
                            ->from('bill_participants')
                            ->where('user_id', $userId);
                    });
            })
            ->pluck('id');

        $splits = DB::table('bill_splits')
            ->leftJoin('bill_participants', 'bill_splits.id', '=', 'bill_participants.bill_split_id')
            ->whereIn('bill_splits.id', $splitIds)
            ->select(
                'bill_splits.title',
                'bill_splits.total_amount',
                'bill_splits.status',
                'bill_splits.split_type',
                'bill_splits.created_at',
                'bill_splits.due_date',
                'bill_participants.name as participant_name',
                'bill_participants.share_amount',
                'bill_participants.has_paid',
                'bill_participants.acceptance_status'
            )
            ->orderBy('bill_splits.created_at', 'desc')
            ->get();

        $csv = "Title,Total Amount,Status,Split Type,Created,Due Date,Participant,Share,Paid,Acceptance\n";

        foreach ($splits as $split) {
            $csv .= sprintf(
                '"%s",%.2f,%s,%s,%s,%s,"%s",%.2f,%s,%s' . "\n",
                $split->title,
                $split->total_amount,
                $split->status,
                $split->split_type,
                $split->created_at,
                $split->due_date ?? '',
                $split->participant_name,
                $split->share_amount,
                $split->has_paid ? 'Yes' : 'No',
                $split->acceptance_status
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="split-bills-' . date('Y-m-d') . '.csv"');
    }
}

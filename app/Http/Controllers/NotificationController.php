<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $notifications = Notification::where('notifiable_id', $userId)
            ->where('notifiable_type', 'App\Models\User')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $unreadCount = Notification::where('notifiable_id', $userId)
            ->where('notifiable_type', 'App\Models\User')
            ->whereNull('read_at')
            ->count();

        return Inertia::render('notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('notifiable_id', Auth::id())
            ->where('notifiable_type', 'App\Models\User')
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        Notification::where('notifiable_id', Auth::id())
            ->where('notifiable_type', 'App\Models\User')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function destroy($id)
    {
        $notification = Notification::where('notifiable_id', Auth::id())
            ->where('notifiable_type', 'App\Models\User')
            ->findOrFail($id);

        $notification->delete();

        return back();
    }

    public function getUnreadCount()
    {
        $count = Notification::where('notifiable_id', Auth::id())
            ->where('notifiable_type', 'App\Models\User')
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}

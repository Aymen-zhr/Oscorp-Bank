<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = DatabaseNotification::latest()->paginate(20);
        return inertia('admin/notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead($id)
    {
        $notification = DatabaseNotification::findOrFail($id);
        $notification->markAsRead();
        return back();
    }

    public function markAllAsRead()
    {
        DatabaseNotification::whereNull('read_at')->update(['read_at' => now()]);
        return back();
    }
}

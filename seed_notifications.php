<?php
$user = App\Models\User::first();
if ($user) {
    $user->notify(new App\Notifications\SystemNotification([
        'type' => 'alert', 
        'title' => 'Security Alert', 
        'message' => 'New login detected from a new device.'
    ]));
    $user->notify(new App\Notifications\SystemNotification([
        'type' => 'success', 
        'title' => 'Transfer Complete', 
        'message' => 'Your transfer of 10,000 MAD was successful.'
    ]));
    $user->notify(new App\Notifications\SystemNotification([
        'type' => 'info', 
        'title' => 'System Update', 
        'message' => 'O.S.C.O.R.P. Core updated to v4.2.'
    ]));
    echo "Seeded successfully.\n";
} else {
    echo "No user found.\n";
}

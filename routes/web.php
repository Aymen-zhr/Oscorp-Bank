<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\GoalsController;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('ai', [\App\Http\Controllers\AIController::class, 'page'])->name('ai');
    Route::post('ai/chat', [\App\Http\Controllers\AIController::class, 'chat'])->name('ai.chat');
    Route::get('transactions', [\App\Http\Controllers\TransactionController::class, 'page'])->name('transactions');
    Route::get('accounts', [AccountController::class, 'page'])->name('accounts');

    Route::get('reports', [\App\Http\Controllers\ReportsController::class, 'page'])->name('reports');
    Route::get('loans', [\App\Http\Controllers\LoansController::class, 'page'])->name('loans');
    Route::get('taxes', [\App\Http\Controllers\TaxesController::class, 'page'])->name('taxes');
    Route::get('subscriptions', [\App\Http\Controllers\SubscriptionsController::class, 'page'])->name('subscriptions');
    Route::get('goals', [\App\Http\Controllers\GoalsController::class, 'page'])->name('goals');
    Route::post('goals', [\App\Http\Controllers\GoalsController::class, 'store'])->name('goals.store');
    Route::post('goals/{goal}/deposit', [\App\Http\Controllers\GoalsController::class, 'deposit'])->name('goals.deposit');
    Route::post('goals/{goal}/unlock', [\App\Http\Controllers\GoalsController::class, 'unlock'])->name('goals.unlock');
    Route::delete('goals/{goal}', [\App\Http\Controllers\GoalsController::class, 'destroy'])->name('goals.destroy');
    
    // Consolidated Settings & Profile Routes
    Route::get('settings', [\App\Http\Controllers\SettingsController::class, 'page'])->name('settings');
    Route::post('settings/profile', [\App\Http\Controllers\SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::post('settings/password', [\App\Http\Controllers\SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::post('settings/preferences', [\App\Http\Controllers\SettingsController::class, 'updatePreferences'])->name('settings.preferences.update');

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
});


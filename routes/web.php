<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('ai', [\App\Http\Controllers\AIController::class, 'page'])->name('ai');
    Route::post('ai/chat', [\App\Http\Controllers\AIController::class, 'chat'])->name('ai.chat');
    Route::get('transactions', [\App\Http\Controllers\TransactionController::class, 'page'])->name('transactions');

    Route::get('reports', [\App\Http\Controllers\ReportsController::class, 'page'])->name('reports');
    Route::get('loans', [\App\Http\Controllers\LoansController::class, 'page'])->name('loans');
    Route::get('taxes', [\App\Http\Controllers\TaxesController::class, 'page'])->name('taxes');
    Route::get('subscriptions', [\App\Http\Controllers\SubscriptionsController::class, 'page'])->name('subscriptions');
    
    // Consolidated Settings & Profile Routes
    Route::get('settings', [\App\Http\Controllers\SettingsController::class, 'page'])->name('settings');
    Route::post('settings/profile', [\App\Http\Controllers\SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::post('settings/password', [\App\Http\Controllers\SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::post('settings/preferences', [\App\Http\Controllers\SettingsController::class, 'updatePreferences'])->name('settings.preferences.update');
});


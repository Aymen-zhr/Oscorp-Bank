<?php

use App\Http\Controllers\BillSplitController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\GoalsController;
use App\Http\Controllers\AllocationsController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\WithdrawalController;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('ai', [\App\Http\Controllers\AIController::class, 'page'])->name('ai');
    Route::post('ai/chat', [\App\Http\Controllers\AIController::class, 'chat'])->name('ai.chat');
    Route::get('transactions', [TransactionController::class, 'page'])->name('transactions');
    Route::get('transactions/export', [TransactionController::class, 'export'])->name('transactions.export');

    Route::get('reports', [\App\Http\Controllers\ReportsController::class, 'page'])->name('reports');
    // Cards & Account
    Route::get('accounts', [AccountController::class, 'cards'])->name('accounts');
    Route::get('cards', [AccountController::class, 'cards'])->name('cards');
    Route::get('account', [AccountController::class, 'profile'])->name('account');
    Route::post('account/currency', [AccountController::class, 'updateCurrency'])->name('account.currency.update');
    Route::get('loans', [\App\Http\Controllers\LoansController::class, 'page'])->name('loans');
    Route::get('taxes', [\App\Http\Controllers\TaxesController::class, 'page'])->name('taxes');
    Route::get('subscriptions', [\App\Http\Controllers\SubscriptionsController::class, 'page'])->name('subscriptions');
    
    Route::get('goals', [\App\Http\Controllers\GoalsController::class, 'page'])->name('goals');
    Route::post('goals', [\App\Http\Controllers\GoalsController::class, 'store'])->name('goals.store');
    Route::post('goals/{goal}/deposit', [\App\Http\Controllers\GoalsController::class, 'deposit'])->name('goals.deposit');
    Route::post('goals/{goal}/unlock', [\App\Http\Controllers\GoalsController::class, 'unlock'])->name('goals.unlock');
    Route::delete('goals/{goal}', [\App\Http\Controllers\GoalsController::class, 'destroy'])->name('goals.destroy');

    Route::get('allocations', [AllocationsController::class, 'page'])->name('allocations');

    // Deposit & Withdrawal
    Route::get('deposit',     [DepositController::class,    'page'])->name('deposit');
    Route::post('deposit',    [DepositController::class,    'store'])->name('deposit.store');
    Route::get('withdrawal',  [WithdrawalController::class, 'page'])->name('withdrawal');
    Route::post('withdrawal', [WithdrawalController::class, 'store'])->name('withdrawal.store');

    // Transfer
    Route::get('transfer', [TransferController::class, 'page'])->name('transfer');
    Route::post('transfer', [TransferController::class, 'store'])->name('transfer.store');

    // Split Bills
    Route::get('split-bills', [BillSplitController::class, 'page'])->name('split-bills');
    Route::get('split-bills/export', [BillSplitController::class, 'export'])->name('split-bills.export');
    Route::post('split-bills', [BillSplitController::class, 'store'])->name('split-bills.store');
    Route::post('split-bills/{id}/pay', [BillSplitController::class, 'markPaid'])->name('split-bills.pay');
    Route::post('split-bills/{id}/settle', [BillSplitController::class, 'settle'])->name('split-bills.settle');
    Route::post('split-bills/{id}/respond', [BillSplitController::class, 'respond'])->name('split-bills.respond');
    Route::post('split-bills/{id}/remind', [BillSplitController::class, 'remind'])->name('split-bills.remind');
    Route::delete('split-bills/{id}', [BillSplitController::class, 'delete'])->name('split-bills.delete');
    
    // Consolidated Settings & Profile Routes
    Route::get('settings', [\App\Http\Controllers\SettingsController::class, 'page'])->name('settings');
    Route::post('settings/profile', [\App\Http\Controllers\SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::post('settings/password', [\App\Http\Controllers\SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::post('settings/preferences', [\App\Http\Controllers\SettingsController::class, 'updatePreferences'])->name('settings.preferences.update');

    // Contacts
    Route::get('contacts', [\App\Http\Controllers\ContactController::class, 'page'])->name('contacts.page');
    Route::get('contacts/api', [\App\Http\Controllers\ContactController::class, 'index'])->name('contacts.index');
    Route::get('contacts/search', [\App\Http\Controllers\ContactController::class, 'search'])->name('contacts.search');
    Route::post('contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::delete('contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
});


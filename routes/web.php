<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\LoanController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AllocationsController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\BillSplitController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalsController;
use App\Http\Controllers\LoansController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReceiveMoneyController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SendMoneyController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SetupAccountController;
use App\Http\Controllers\SubscriptionsController;
use App\Http\Controllers\TaxesController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('auth')->group(function () {
    Route::get('{provider}/redirect', [OAuthController::class, 'redirect'])->name('oauth.redirect');
    Route::get('{provider}/callback', [OAuthController::class, 'callback'])->name('oauth.callback');
});

// Setup Account (auth required, but NOT verified - user needs to complete profile first)
Route::middleware('auth')->group(function () {
    Route::get('setup-account', [SetupAccountController::class, 'page'])->name('setup-account');
    Route::post('setup-account', [SetupAccountController::class, 'store'])->name('setup-account.store');
});

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

    // Send & Receive Money
    Route::get('send', [SendMoneyController::class, 'page'])->name('send');
    Route::post('send', [SendMoneyController::class, 'store'])->name('send.store');
    Route::get('receive', [ReceiveMoneyController::class, 'page'])->name('receive');
    Route::post('receive', [ReceiveMoneyController::class, 'requestPayment'])->name('receive.request');

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

    // Admin Panel
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');

        Route::get('/users', [\App\Http\Controllers\Admin\AdminController::class, 'users'])->name('users');
        Route::get('/users/{user}', [\App\Http\Controllers\Admin\AdminController::class, 'showUser'])->name('users.show');
        Route::put('/users/{user}', [\App\Http\Controllers\Admin\AdminController::class, 'updateUser'])->name('users.update');
        Route::post('/users/{user}/toggle-admin', [\App\Http\Controllers\Admin\AdminController::class, 'toggleAdmin'])->name('users.toggle-admin');

        Route::get('/accounts', [\App\Http\Controllers\Admin\AccountController::class, 'index'])->name('accounts');
        Route::post('/accounts/{user}/toggle-status', [\App\Http\Controllers\Admin\AccountController::class, 'toggleStatus'])->name('accounts.toggle-status');

        Route::get('/transactions', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('transactions');
        Route::get('/transactions/search-users', [\App\Http\Controllers\Admin\TransactionController::class, 'searchUsers'])->name('transactions.search-users');
        Route::get('/transactions/{transaction}', [\App\Http\Controllers\Admin\TransactionController::class, 'show'])->name('transactions.show');
        Route::post('/transactions/{transaction}/status', [\App\Http\Controllers\Admin\TransactionController::class, 'updateStatus'])->name('transactions.update-status');
        Route::post('/transactions/{transaction}/flag', [\App\Http\Controllers\Admin\TransactionController::class, 'flag'])->name('transactions.flag');

        Route::get('/loans', [\App\Http\Controllers\Admin\LoanController::class, 'index'])->name('loans');
        Route::get('/loans/search-users', [\App\Http\Controllers\Admin\LoanController::class, 'searchUsers'])->name('loans.search-users');
        Route::get('/loans/{loan}', [\App\Http\Controllers\Admin\LoanController::class, 'show'])->name('loans.show');
        Route::post('/loans/{loan}/approve', [\App\Http\Controllers\Admin\LoanController::class, 'approve'])->name('loans.approve');
        Route::post('/loans/{loan}/reject', [\App\Http\Controllers\Admin\LoanController::class, 'reject'])->name('loans.reject');

        Route::get('/bill-splits', [\App\Http\Controllers\Admin\BillSplitController::class, 'index'])->name('bill-splits');
        Route::get('/bill-splits/search-users', [\App\Http\Controllers\Admin\BillSplitController::class, 'searchUsers'])->name('bill-splits.search-users');
        Route::delete('/bill-splits/{id}', [\App\Http\Controllers\Admin\BillSplitController::class, 'destroy'])->name('bill-splits.destroy');

        Route::get('/notifications', [\App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/mark-all-read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');

        Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');

        Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

        Route::get('/audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit-logs');
    });

    // Contacts
    Route::get('contacts', [\App\Http\Controllers\ContactController::class, 'page'])->name('contacts.page');
    Route::get('contacts/api', [\App\Http\Controllers\ContactController::class, 'index'])->name('contacts.index');
    Route::get('contacts/search', [\App\Http\Controllers\ContactController::class, 'search'])->name('contacts.search');
    Route::post('contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::post('contacts/{id}/accept', [\App\Http\Controllers\ContactController::class, 'acceptRequest'])->name('contacts.accept');
    Route::post('contacts/{id}/deny', [\App\Http\Controllers\ContactController::class, 'denyRequest'])->name('contacts.deny');
    Route::delete('contacts/{contact}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::post('notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markRead');
});

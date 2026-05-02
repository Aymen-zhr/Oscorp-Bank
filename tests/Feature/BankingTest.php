<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

/* ── Dashboard ─────────────────────────────────────── */

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard shows balance data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    DB::table('transactions')->insert([
        'merchant' => 'Test Credit',
        'type' => 'credit',
        'category' => 'Salary',
        'amount' => 10000,
        'transacted_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('balance')
    );
});

/* ── Transactions ──────────────────────────────────── */

test('transactions page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('transactions'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('transactions')
             ->has('filters')
             ->has('categories')
             ->has('stats')
    );
});

test('transactions can be filtered by type', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    DB::table('transactions')->insert([
        'merchant' => 'Credit Test',
        'type' => 'credit',
        'category' => 'Salary',
        'amount' => 5000,
        'transacted_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get(route('transactions', ['type' => 'credit']));
    $response->assertOk();
});

test('transactions can be exported as CSV', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    DB::table('transactions')->insert([
        'merchant' => 'Export Test',
        'type' => 'credit',
        'category' => 'Salary',
        'amount' => 10000,
        'transacted_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get(route('transactions.export'));
    $response->assertOk();
    $response->assertHeader('Content-Type');
    expect($response->headers->get('Content-Type'))->toContain('text/csv');
});

/* ── Deposit ───────────────────────────────────────── */

test('deposit page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('deposit'));
    $response->assertOk();
});

test('can create a deposit', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('deposit.store'), [
        'amount' => 5000,
        'source' => 'Bank Transfer',
        'note' => 'Test deposit',
    ]);

    $response->assertRedirect(route('deposit'));
    $this->assertDatabaseHas('transactions', [
        'type' => 'credit',
        'category' => 'Deposit',
        'merchant' => 'OSCORP Deposit',
    ]);
});

test('deposit amount must be positive', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('deposit.store'), [
        'amount' => -100,
        'source' => 'Bank Transfer',
    ]);

    $response->assertSessionHasErrors('amount');
});

test('deposit amount cannot exceed maximum', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('deposit.store'), [
        'amount' => 600000,
        'source' => 'Bank Transfer',
    ]);

    $response->assertSessionHasErrors('amount');
});

/* ── Withdrawal ────────────────────────────────────── */

test('withdrawal page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('withdrawal'));
    $response->assertOk();
});

test('cannot withdraw more than balance', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('withdrawal.store'), [
        'amount' => 999999999,
        'source' => 'Bank Transfer',
    ]);

    $response->assertSessionHasErrors('amount');
});

/* ── Goals ─────────────────────────────────────────── */

test('goals page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('goals'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('goals')
    );
});

test('can create a savings goal', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('goals.store'), [
        'name' => 'New Car',
        'icon' => 'car',
        'target_amount' => 50000,
        'target_months' => 12,
    ]);

    $response->assertRedirect(route('goals'));
    $this->assertDatabaseHas('goals', [
        'user_id' => $user->id,
        'name' => 'New Car',
        'target_amount' => 50000,
    ]);
});

test('can deposit to a goal', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $goal = DB::table('goals')->insertGetId([
        'user_id' => $user->id,
        'name' => 'Test Goal',
        'icon' => 'target',
        'target_amount' => 10000,
        'target_months' => 6,
        'monthly_savings' => 1666.67,
        'current_savings' => 0,
        'status' => 'active',
        'start_date' => now(),
        'target_date' => now()->addMonths(6),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->post(route('goals.deposit', $goal), [
        'amount' => 1000,
    ]);

    $response->assertRedirect(route('goals'));
    $this->assertDatabaseHas('goals', [
        'id' => $goal,
        'current_savings' => 1000,
    ]);
});

/* ── AI Chat ───────────────────────────────────────── */

test('AI chat page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('ai'));
    $response->assertOk();
});

test('AI chat requires messages array', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('ai.chat'));
    $response->assertStatus(302);
});

/* ── Notifications ─────────────────────────────────── */

test('notifications page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('notifications.index'));
    $response->assertOk();
});

/* ── Settings ──────────────────────────────────────── */

test('settings page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('settings'));
    $response->assertOk();
});

test('can update profile', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('settings.profile.update'), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

/* ── Reports ───────────────────────────────────────── */

test('reports page loads with financial data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('reports'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('stats')
             ->has('monthlyData')
             ->has('spendingCategories')
    );
});

/* ── Accounts ──────────────────────────────────────── */

test('accounts page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('accounts'));
    $response->assertOk();
});

/* ── Loans ─────────────────────────────────────────── */

test('loans page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('loans'));
    $response->assertOk();
});

/* ── Taxes ─────────────────────────────────────────── */

test('taxes page loads with tax data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('taxes'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('taxDocuments')
             ->has('taxCategories')
             ->has('upcomingDeadlines')
             ->has('stats')
    );
});

/* ── Subscriptions ─────────────────────────────────── */

test('subscriptions page loads for authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('subscriptions'));
    $response->assertOk();
});

/* ── Allocations ───────────────────────────────────── */

test('allocations page loads with category data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('allocations'));
    $response->assertOk();
    $response->assertInertia(fn($page) =>
        $page->has('categories')
             ->has('totalAllocation')
    );
});

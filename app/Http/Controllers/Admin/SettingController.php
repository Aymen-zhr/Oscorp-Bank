<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('admin/settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'nullable|string|max:255',
            'app_url' => 'nullable|url|max:255',
            'maintenance_mode' => 'boolean',
            'registration_enabled' => 'boolean',
            'min_loan_amount' => 'nullable|numeric|min:0',
            'max_loan_amount' => 'nullable|numeric|min:0',
            'default_loan_rate' => 'nullable|numeric|min:0|max:100',
            'transfer_fee_percent' => 'nullable|numeric|min:0|max:100',
            'support_email' => 'nullable|email|max:255',
            'max_daily_transfer' => 'nullable|numeric|min:0',
            'currency_symbol' => 'nullable|string|max:10',
            'enable_2fa' => 'boolean',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}

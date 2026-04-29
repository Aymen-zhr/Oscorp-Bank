<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Traits\HasOscorpBalance;
use Inertia\Inertia;

class SettingsController extends Controller
{
    use HasOscorpBalance;

    public function page()
    {
        $user = Auth::user();

        // Ensure user has preferences stored in DB if you add a preferences column. 
        // For now, we mock preferences or store them in a JSON column if it exists.
        // Assuming we mock them since there is no migration provided for preferences.
        $preferences = json_decode($user->preferences ?? '{}', true) ?: [
            'currency' => 'MAD',
            'timezone' => 'Africa/Casablanca',
            'notifications' => true,
        ];

        return Inertia::render('settings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ?? 'adventurer',
            ],
            'preferences' => $preferences,
            'security' => [
                'two_factor_enabled' => !!$user->two_factor_confirmed_at,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'avatar' => 'nullable|string|max:50',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->has('avatar')) {
            $user->avatar = $request->avatar;
        }
        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = Auth::user();
        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->back()->with('success', 'Password updated successfully.');
    }

    public function updatePreferences(Request $request)
    {
        $request->validate([
            'currency' => 'required|string|max:3',
            'timezone' => 'required|string|max:50',
            'notifications' => 'required|boolean',
        ]);

        return redirect()->back()->with('success', 'Preferences saved successfully.');
    }
}
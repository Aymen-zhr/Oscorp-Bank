<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
        $preferences = ($user->preferences ?? []) ?: [
            'currency' => 'MAD',
            'timezone' => 'Africa/Casablanca',
            'notifications' => true,
        ];

        return Inertia::render('settings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ?? 'adventurer',
                'phone' => $user->phone,
                'tag' => $user->tag,
                'job_title' => $user->job_title,
                'address' => $user->address,
                'cin' => $user->cin,
                'date_of_birth' => $user->date_of_birth,
                'place_of_birth' => $user->place_of_birth,
                'nationality' => $user->nationality,
                'gender' => $user->gender,
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
            'avatar' => 'nullable',
            'phone' => 'nullable|string|max:20',
            'tag' => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'cin' => 'nullable|string|max:20|unique:users,cin,'.$user->id,
            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:50',
            'gender' => 'nullable|in:male,female',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->tag = $request->tag;
        $user->job_title = $request->job_title;
        $user->address = $request->address;
        $user->cin = $request->cin;
        $user->date_of_birth = $request->date_of_birth;
        $user->place_of_birth = $request->place_of_birth;
        $user->nationality = $request->nationality;
        $user->gender = $request->gender;

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('avatars', $filename, 'public');
            
            // Delete old avatar if it was a file
            if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }
            
            $user->avatar = '/storage/' . $path;
        } elseif ($request->has('avatar') && is_string($request->avatar)) {
            // If it's a DiceBear string, we just save it
            // If user previously had a custom avatar, we might want to delete it
            if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
                 \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }
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

        $user = Auth::user();
        $existingPreferences = $user->preferences ?? [];
        $user->preferences = array_merge($existingPreferences, [
            'currency' => $request->currency,
            'timezone' => $request->timezone,
            'notifications' => $request->notifications,
        ]);
        $user->save();

        return redirect()->back()->with('success', 'Preferences saved successfully.');
    }
}
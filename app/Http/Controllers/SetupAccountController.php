<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SetupAccountController extends Controller
{
    public function page()
    {
        return inertia('setup-account', [
            'setupConfig' => config('setup-account'),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Clean CIN before validation to ensure unique check works correctly
        if ($request->has('cin')) {
            $request->merge([
                'cin' => strtoupper(preg_replace('/\s/', '', $request->input('cin'))),
            ]);
        }

        $rules = [
            'phone' => [
                'required', 'string', 'max:20',
                function ($attribute, $value, $fail) {
                    $cleaned = preg_replace('/[\s\-\(\)]/', '', $value);
                    if (!preg_match('/^(\+212\d{9}|0\d{9}|\+\d{9,15})$/', $cleaned)) {
                        $fail('Enter a valid phone number (e.g., +212 6XX XXX XXX).');
                    }
                },
            ],
            'job_title' => ['required', 'string', 'min:2', 'max:100'],
            'address' => ['required', 'string', 'min:5', 'max:500'],
            'cin' => [
                'required', 'string', 'max:20',
                Rule::unique('users', 'cin')->ignore($user->id),
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^[A-Z]{1,2}\d{6}$/', $value)) {
                        $fail('CIN format must be 1-2 letters followed by 6 digits (e.g., AB123456).');
                    }
                },
            ],
            'date_of_birth' => [
                'required', 'date', 'before:' . now()->subYears(18)->format('Y-m-d'),
            ],
            'place_of_birth' => ['required', 'string', 'min:2', 'max:100'],
            'nationality' => ['required', 'string', 'min:2', 'max:50'],
            'gender' => ['required', 'in:male,female'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];

        $validator = Validator::make($request->all(), $rules);

        $validator->after(function ($validator) use ($request) {
            $fields = ['job_title', 'address', 'place_of_birth', 'nationality'];
            foreach ($fields as $field) {
                $value = trim($request->input($field, ''));
                if ($value && strlen($value) < 2) {
                    $validator->errors()->add($field, 'Please enter a valid value.');
                }
                if ($value && preg_match('/^(test|asdf|qwerty|xxxx|aaaa|1234|zzzz|foo|bar)$/i', $value)) {
                    $validator->errors()->add($field, 'Please enter real information.');
                }
                if ($value && preg_match('/^([a-zA-Z])\1{3,}$/', $value)) {
                    $validator->errors()->add($field, 'Please enter a valid value.');
                }
            }
        });

        $validator->validate();

        $updateData = $request->only([
            'phone', 'job_title', 'address', 'cin', 'date_of_birth',
            'place_of_birth', 'nationality', 'gender'
        ]);

        $updateData['cin'] = strtoupper(preg_replace('/\s/', '', $updateData['cin']));

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('avatars', $filename, 'public');

            if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }

            $updateData['avatar'] = '/storage/' . $path;
        }

        // Filter out null values but keep everything else
        $updateData = array_filter($updateData, fn($v) => $v !== null && $v !== '');

        $user->fill($updateData);
        $user->save();
        $user->refresh();

        $request->session()->put('setup_complete', true);
        $request->session()->save();

        return redirect()->route('dashboard')->with('success', 'Profile completed successfully!');
    }
}

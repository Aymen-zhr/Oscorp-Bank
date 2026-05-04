<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'phone' => ['required', 'string', 'max:20'],
            'job_title' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
            'password' => $this->passwordRules(),
        ])->validate();

        $baseTag = '@' . \Illuminate\Support\Str::slug($input['name'], '_');
        $tag = $baseTag;
        $counter = 1;
        while (User::where('tag', $tag)->exists()) {
            $tag = $baseTag . $counter++;
        }

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'tag' => $tag,
            'phone' => $input['phone'],
            'job_title' => $input['job_title'],
            'address' => $input['address'],
        ]);
    }
}

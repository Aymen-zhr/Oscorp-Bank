<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['oauth' => 'Authentication failed. Please try again.']);
        }

        $user = User::where('oauth_provider', $provider)
            ->where('oauth_id', $socialUser->getId())
            ->first();

        if (! $user) {
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                $user->update([
                    'oauth_id' => $socialUser->getId(),
                    'oauth_provider' => $provider,
                    'oauth_avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                $baseTag = '@'.Str::slug(explode(' ', $socialUser->getName())[0], '_');
                $tag = $baseTag;
                $counter = 1;
                while (User::where('tag', $tag)->exists()) {
                    $tag = $baseTag.$counter++;
                }

                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'password' => bcrypt(Str::random(40)),
                    'oauth_id' => $socialUser->getId(),
                    'oauth_provider' => $provider,
                    'oauth_avatar' => $socialUser->getAvatar(),
                    'tag' => $tag,
                    'email_verified_at' => now(),
                ]);
            }
        }

        Auth::login($user);

        return redirect()->to($user->isAdmin() ? '/admin' : '/setup-account');
    }
}

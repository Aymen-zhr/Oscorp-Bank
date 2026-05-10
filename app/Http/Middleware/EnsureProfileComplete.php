<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnsureProfileComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user || $user->isAdmin()) {
            return $next($request);
        }

        if ($request->routeIs('home') || $request->routeIs('setup-account') || $request->routeIs('setup-account.store') || $request->routeIs('logout')) {
            return $next($request);
        }

        if ($request->session()->get('setup_complete')) {
            return $next($request);
        }

        if (blank($user->phone) || blank($user->job_title) || blank($user->address) || blank($user->cin) || blank($user->date_of_birth) || blank($user->place_of_birth) || blank($user->nationality) || blank($user->gender)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Profile incomplete'], 403);
            }

            return Inertia::location(route('setup-account'));
        }

        $request->session()->put('setup_complete', true);

        return $next($request);
    }
}

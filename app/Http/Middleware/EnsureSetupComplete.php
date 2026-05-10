<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureSetupComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && !$user->is_admin) {
            $requiredFields = ['phone', 'job_title', 'address', 'cin', 'date_of_birth', 'place_of_birth', 'nationality', 'gender'];
            $isComplete = true;
            foreach ($requiredFields as $field) {
                if (empty($user->$field)) {
                    $isComplete = false;
                    break;
                }
            }

            if (!$isComplete && !$request->routeIs('setup-account', 'setup-account.store')) {
                return redirect()->route('setup-account');
            }
        }

        return $next($request);
    }
}

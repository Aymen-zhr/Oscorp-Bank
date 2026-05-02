<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale', config('app.locale', 'en'));

        if (in_array($locale, ['en', 'fr', 'ar'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}

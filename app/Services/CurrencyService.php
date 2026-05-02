<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class CurrencyService
{
    protected function getUserCurrency(): string
    {
        $user = Auth::user();
        if ($user && $user->preferences) {
            $prefs = is_string($user->preferences) ? json_decode($user->preferences, true) : $user->preferences;
            if (isset($prefs['currency'])) {
                return $prefs['currency'];
            }
        }
        return config('currencies.default', 'MAD');
    }

    public function convert(float $amountMAD, ?string $targetCurrency = null): float
    {
        $currency = $targetCurrency ?? $this->getUserCurrency();
        $rates = config('currencies.currencies', []);

        if (!isset($rates[$currency])) {
            return $amountMAD;
        }

        $rate = $rates[$currency]['rate'] ?? 1.0;
        $converted = $amountMAD * $rate;

        $decimalDigits = $rates[$currency]['decimal_digits'] ?? 2;
        return round($converted, $decimalDigits);
    }

    public function format(float $amountMAD, ?string $targetCurrency = null, bool $showSymbol = true): string
    {
        $currency = $targetCurrency ?? $this->getUserCurrency();
        $rates = config('currencies.currencies', []);

        if (!isset($rates[$currency])) {
            return number_format($amountMAD, 2) . ' MAD';
        }

        $converted = $this->convert($amountMAD, $currency);
        $symbol = $rates[$currency]['symbol'];
        $locale = $rates[$currency]['locale'] ?? 'en-US';
        $decimalDigits = $rates[$currency]['decimal_digits'] ?? 2;

        $formatted = number_format($converted, $decimalDigits, '.', ',');

        if ($showSymbol) {
            return $formatted . ' ' . $symbol;
        }

        return $formatted;
    }

    public function getUserCurrencyCode(): string
    {
        return $this->getUserCurrency();
    }

    public function getUserCurrencyInfo(): array
    {
        $code = $this->getUserCurrencyCode();
        $rates = config('currencies.currencies', []);

        return $rates[$code] ?? $rates['MAD'];
    }

    public function getAllCurrencies(): array
    {
        return config('currencies.currencies', []);
    }
}

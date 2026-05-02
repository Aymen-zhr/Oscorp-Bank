<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TransactionService
{
    public function create(array $data): array
    {
        $defaults = [
            'user_id' => Auth::id(),
            'status' => 'completed',
            'transacted_at' => now(),
        ];

        $attributes = array_merge($defaults, $data);

        DB::table('transactions')->insert($attributes);

        return $attributes;
    }

    public function getLatestByCategory(string $category, int $limit = 10)
    {
        return DB::table('transactions')
            ->where('user_id', Auth::id())
            ->where('category', $category)
            ->orderBy('transacted_at', 'desc')
            ->take($limit)
            ->get();
    }

    public function getBeneficiaries(int $limit = 8)
    {
        return DB::table('transactions')
            ->where('user_id', Auth::id())
            ->where('type', 'debit')
            ->where('category', 'Transfer')
            ->select('merchant', DB::raw('MAX(logo_color) as color'), DB::raw('COUNT(*) as count'))
            ->groupBy('merchant')
            ->orderByDesc('count')
            ->take($limit)
            ->get();
    }
}

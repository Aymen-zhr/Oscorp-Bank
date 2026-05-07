<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // Basic stats for the admin dashboard
        $stats = [
            'total_users' => User::count(),
            'total_transactions' => DB::table('transactions')->count(),
            'total_volume' => DB::table('transactions')->sum('amount'),
            'recent_users' => User::orderBy('created_at', 'desc')->take(5)->get(),
        ];

        return Inertia::render('admin', [
            'stats' => $stats
        ]);
    }
}

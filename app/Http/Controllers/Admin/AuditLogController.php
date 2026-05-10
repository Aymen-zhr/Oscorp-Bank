<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = DB::table('audit_logs')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/audit-logs', [
            'logs' => $logs,
        ]);
    }
}

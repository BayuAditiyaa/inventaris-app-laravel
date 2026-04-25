<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        Gate::authorize('viewReports');

        $logs = ActivityLog::query()
            ->with('user')
            ->when(request('action'), fn ($query) => $query->where('action', request('action')))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(function (ActivityLog $log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'subject_type' => $log->subject_type,
                    'subject_id' => $log->subject_id,
                    'properties' => $log->properties,
                    'created_at' => $log->created_at?->toIso8601String(),
                    'user_name' => $log->user?->name,
                ];
            });

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => [
                'action' => request('action'),
            ],
        ]);
    }
}

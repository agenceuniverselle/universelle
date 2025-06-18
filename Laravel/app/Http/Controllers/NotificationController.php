<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'content' => 'required|string',
        ]);

        return Notification::create($validated);
    }

    public function markAsRead($id)
    {
        $notif = Notification::findOrFail($id);
        $notif->is_read = true;
        $notif->save();

        return response()->json(['status' => 'read']);
    }
}

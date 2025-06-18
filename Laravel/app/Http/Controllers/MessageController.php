<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Notification;
class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bien_id' => 'required|exists:biens,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'contact_method' => 'required|string',
            'visit_type' => 'nullable|string',
            'visit_date' => 'nullable|date',
            'message' => 'nullable|string',
            'consent'    => 'nullable|boolean',

        ]);

        $message = Message::create($validated);
// ✅ Créer une notification
        Notification::create([
            'type' => 'message',
            'content' => "📩 Nouveau message de {$message->name} ({$message->email}) pour le bien #{$message->bien_id}.",
        ]);
        return response()->json($message, 201);
    }
     // Liste tous les messages paginés (ou non)
    public function index()
    {
        // Option 1: récupérer tous les messages
        $messages = Message::orderBy('created_at', 'desc')->get();

        // Option 2: avec pagination (exemple 10 par page)
        // $messages = Message::orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'data' => $messages
        ], 200);
    }

    // Supprime un message par son ID
    public function destroy($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'error' => 'Message non trouvé.'
            ], 404);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès.'
        ], 200);
    }

}

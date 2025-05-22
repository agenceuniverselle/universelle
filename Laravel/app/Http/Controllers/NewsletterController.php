<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email'
        ]);

        $subscriber = Subscriber::create($validated);

        return response()->json([
            'message' => 'Merci pour votre inscription !',
            'data' => $subscriber
        ], 201);
    }
    public function index()
{
    $subscribers = Subscriber::all();

    return response()->json([
        'message' => 'Liste des abonnés récupérée avec succès',
        'data' => $subscribers
    ]);
}
//supprimer newsletter
public function destroy($id)
{
    $subscriber = Subscriber::find($id);

    if (!$subscriber) {
        return response()->json(['message' => 'Abonné non trouvé.'], 404);
    }

    $subscriber->delete();

    return response()->json(['message' => 'Abonné supprimé avec succès.']);
}

}


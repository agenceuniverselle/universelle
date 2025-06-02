<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|min:2',
            'email'   => 'required|email',
            'phone'   => 'required|string|min:5',
            'budget'  => 'required|string',
            'purpose' => 'required|string',
            'message' => 'nullable|string',
            'consent' => 'nullable|boolean',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Contact enregistré avec succès',
            'data' => $contact
        ], 201);
    }
    //afficher les contacts
    public function index()
{
    $contacts = Contact::all();

    return response()->json([
        'message' => 'Liste des contacts récupérée avec succès',
        'data' => $contacts
    ]);
}
//supprimer les contacts 
public function destroy($id)
{
    $contact = Contact::find($id);

    if (!$contact) {
        return response()->json(['message' => 'Contact non trouvé.'], 404);
    }

    $contact->delete();

    return response()->json(['message' => 'Contact supprimé avec succès.']);
}


}


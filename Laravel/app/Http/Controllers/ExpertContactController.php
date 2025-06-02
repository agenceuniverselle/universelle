<?php

namespace App\Http\Controllers;

use App\Models\ExpertContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExpertContactController extends Controller
{
    public function store(Request $request)
    {
        // Validation des données - CORRIGÉ : utiliser les noms snake_case
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:50',
            'message'        => 'required|string',
            'preferred_date' => 'nullable|date',           // CORRIGÉ
            'expert'         => 'required|string|max:100',
            'service_type'   => 'nullable|string|max:100', // CORRIGÉ
            'consent'        => 'nullable|boolean',
        ], [
            'consent.accepted' => "Vous devez accepter la politique de confidentialité.",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Création du contact expert - CORRIGÉ : utiliser les bons noms de champs
        $contact = ExpertContact::create([
            'name'           => $request->name,
            'email'          => $request->email,
            'phone'          => $request->phone,
            'message'        => $request->message,
            'preferred_date' => $request->preferred_date, // CORRIGÉ
            'expert'         => $request->expert,
            'service_type'   => $request->service_type,   // CORRIGÉ
            'consent'        => $request->consent,
        ]);

        // Ici tu peux déclencher un email, notification, etc.

        return response()->json([
            'message' => 'Demande envoyée avec succès',
            'data' => $contact
        ], 201);
    }
     public function index()
    {
      
        $expertContacts = ExpertContact::orderBy('created_at', 'desc')->get();
        return response()->json($expertContacts);
    }
     public function show($id)
    {
        // if (!Auth::user()->hasPermissionTo('view_expert_contacts')) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $expertContact = ExpertContact::find($id);

        if (!$expertContact) {
            return response()->json(['message' => 'Expert contact not found'], 404);
        }

        return response()->json($expertContact);
    }
    public function update(Request $request, $id)
    {
        

        $expertContact = ExpertContact::find($id);

        if (!$expertContact) {
            return response()->json(['message' => 'Expert contact not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string',
            'preferred_date' => 'nullable|date',
            'expert' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'consent' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expertContact->update($request->all());
        return response()->json($expertContact);
    }
    public function destroy($id)
    {
        // if (!Auth::user()->hasPermissionTo('delete_expert_contacts')) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $expertContact = ExpertContact::find($id);

        if (!$expertContact) {
            return response()->json(['message' => 'Expert contact not found'], 404);
        }

        $expertContact->delete();
        return response()->json(['message' => 'Expert contact deleted successfully'], 200);
    }
}
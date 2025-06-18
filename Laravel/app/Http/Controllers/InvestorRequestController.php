<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InvestorRequest;
use App\Models\Notification;
class InvestorRequestController extends Controller
{
    //Afficher 
       public function index()
    {
        $investorRequests = InvestorRequest::all();

        return response()->json([
            'data' => $investorRequests,
        ], 200);
    }
     //Afficher un investisseur par ID
    public function show($id)
    {
        $investorRequest = InvestorRequest::find($id);

        if (!$investorRequest) {
            return response()->json([
                'message' => 'Investisseur non trouvé.'
            ], 404);
        }

        return response()->json($investorRequest, 200);
    }
    //stocker avec id property not obligatoire
     public function storeprospect(Request $request)
    {
        $validated = $request->validate([
            'montant_investissement' => 'required|string',
            'type_participation' => 'required|string',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:investor_requests,email',
            'telephone' => 'required|string',
            'nationalite' => 'required|string',
            'commentaire' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'consent' => 'required|boolean', // Optionnel pour les prospects
        ]);

        $prospect = InvestorRequest::create([
            'property_id' => $validated['property_id'] ?? null, // Peut être null
            'montant_investissement' => $validated['montant_investissement'],
            'type_participation' => $validated['type_participation'],
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'nationalite' => $validated['nationalite'],
            'commentaire' => $validated['commentaire'] ?? null,
            'consent' => $validated['consent'],
        ]);
 
        return response()->json([
            'message' => 'Prospect ajouté avec succès.',
            'data' => $prospect,
        ], 201);
    }

    //Stocker
    public function store(Request $request, $propertyId)
    {
        $validated = $request->validate([
            'montant_investissement' => 'required|string',
            'type_participation' => 'required|string',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'nationalite' => 'required|string',
            'commentaire' => 'nullable|string',
            'consent' => 'required|boolean',
        ]);

        $investorRequest = InvestorRequest::create([
            'property_id' => $propertyId,
            ...$validated,
              'consent' => $validated['consent'],
        ]);
 Notification::create([
            'type' => 'investor',
            'content' => "📩 Nouveau prospect investisseur : {$validated['prenom']} {$validated['nom']}.",
        ]);
        return response()->json([
            'message' => 'Demande enregistrée avec succès.',
            'data' => $investorRequest,
        ], 201);
    }
    //update 
    public function update(Request $request, $id)
{
    $investorRequest = InvestorRequest::find($id);

    if (!$investorRequest) {
        return response()->json([
            'message' => 'Demande non trouvée.'
        ], 404);
    }

    $validated = $request->validate([
        'montant_investissement' => 'required|string',
        'type_participation' => 'required|string',
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|email',
        'telephone' => 'required|string',
        'nationalite' => 'nullable|string',
        'commentaire' => 'nullable|string',
        'consent' => 'nullable|boolean',
    ]);

    $investorRequest->update($validated);

    return response()->json([
        'message' => 'Demande mise à jour avec succès.',
        'data' => $investorRequest,
    ], 200);
}

    //Supprimer
     public function destroy($id)
    {
        $investorRequest = InvestorRequest::find($id);

        if (!$investorRequest) {
            return response()->json([
                'message' => 'Demande non trouvée.'
            ], 404);
        }

        $investorRequest->delete();

        return response()->json([
            'message' => 'Demande supprimée avec succès.'
        ], 200);
    }
}

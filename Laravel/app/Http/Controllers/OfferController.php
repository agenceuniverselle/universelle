<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;

class OfferController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'bien_id' => 'required|exists:biens,id',
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email',
        'phone' => 'required|string',
        'offer' => 'required|string',
        'financing' => 'required|in:cash,mortgage,other',
        'message' => 'nullable|string',
    ]);

    $offer = Offer::create($validated);

    return response()->json([
        'message' => 'Offre enregistrée avec succès',
        'data' => $offer
    ], 201);
}
//— récupérer toutes les offres
    public function index()
    {
        $offers = Offer::all();

        return response()->json([
            'message' => 'Liste des offres récupérée avec succès',
            'data' => $offers
        ]);
    }
//supprimer les offres
public function destroy($id)
{
    $offer = Offer::find($id);

    if (!$offer) {
        return response()->json(['message' => 'Offre non trouvée.'], 404);
    }

    $offer->delete();

    return response()->json(['message' => 'Offre supprimée avec succès.']);
}

}

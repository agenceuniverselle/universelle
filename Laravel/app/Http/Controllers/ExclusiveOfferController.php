<?php

namespace App\Http\Controllers;

use App\Models\ExclusiveOffer;
use Illuminate\Http\Request;
use App\Events\ActivityLogged;
use Illuminate\Support\Facades\Auth;
use App\Models\Property;

class ExclusiveOfferController extends Controller
{
 
    public function index()
    {
        $offers = ExclusiveOffer::with('property')->get();
    
        $offersWithImages = $offers->map(function ($offer) {
            $property = $offer->property;
            if ($property) {
                // Décode les images si elles sont stockées en JSON
                $property->images = is_array($property->images) 
                    ? $property->images 
                    : json_decode($property->images, true) ?? [];
            }
            return $offer;
        });
    
        return response()->json($offersWithImages);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'current_value' => 'required|numeric',
            'monthly_rental_income' => 'required|numeric',
            'annual_growth_rate' => 'required|numeric',
            'duration_years' => 'required|integer',
            'initial_investment' => 'required|numeric', // <-- ici aussi

        ]);

        $offer = ExclusiveOffer::create($validated);
        $property = Property::find($validated['property_id']);
        $propertyTitle = $property ? $property->title : 'Non spécifié';

        event(new ActivityLogged(
            'add_ExclusiveOffer',
            "Un nouveau offre exclusive pour le bien {$propertyTitle} a été ajouté.",
            Auth::check() ? Auth::id() : null
        ));
        return response()->json(['message' => 'Exclusive offer created successfully.', 'data' => $offer], 201);
    }

//details offer by id 
public function show($id)
{
    $offer = ExclusiveOffer::with('property')->findOrFail($id);

    if ($offer->property) {
        $offer->property->images = is_array($offer->property->images)
            ? $offer->property->images
            : json_decode($offer->property->images, true) ?? [];
    }

    return response()->json(['data' => $offer]);
}
//update offre exclusive
public function update(Request $request, $id)
{
    $offer = ExclusiveOffer::findOrFail($id);

    $validated = $request->validate([
        'property_id' => 'required|exists:properties,id',
        'current_value' => 'required|numeric',
        'initial_investment' => 'required|numeric',
        'monthly_rental_income' => 'required|numeric',
        'annual_growth_rate' => 'required|numeric',
        'duration_years' => 'required|integer',
    ]);

    $offer->update($validated);
 // ✅ Utilisation du titre du bien associé
 $property = Property::find($validated['property_id']);
 $propertyTitle = $property ? $property->title : 'Non spécifié';

 event(new ActivityLogged(
     'update_ExclusiveOffer',
     "L'offre exclusive pour le bien {$propertyTitle} a été mise à jour.",
     Auth::check() ? Auth::id() : null
 ));
    return response()->json([
        'message' => 'Offre exclusive mise à jour avec succès.',
        'data' => $offer->fresh()
    ]);
}
//delete offre exclusive 
public function destroy($id)
    {
        $offer = ExclusiveOffer::find($id);
        if (!$offer) {
            return response()->json(['message' => 'Offre non trouvée'], 404);
        }
        $propertyTitle = $offer->property ? $offer->property->title : 'Non spécifié';
        $offer->delete();
        // ✅ Journalisation de l'activité
        event(new ActivityLogged(
            'delete_ExclusiveOffer',
            "L'offre exclusive pour le bien {$propertyTitle} a été supprimée.",
            Auth::check() ? Auth::id() : null
        ));
        return response()->json(['message' => 'Offre supprimée avec succès']);
    }
}

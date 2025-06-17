<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image; // Importer la bibliothèque Intervention Image
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\File;
use Illuminate\Http\JsonResponse;
use App\Events\ActivityLogged;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validation des données du formulaire
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'price' => 'required|numeric',
                'status' => 'required|in:Disponible,Réservé,Vendu',
                'location' => 'required|string',
                'area' => 'required|integer',
                'bedrooms' => 'required|integer',
                'bathrooms' => 'required|integer',
                'description' => 'required|string',
                'investmentType' => 'required|in:Résidentiel,Commercial,Touristique,Mixte',
                'projectStatus' => 'required|in:Pré-commercialisation,En cours,Terminé',
                'returnRate' => 'nullable|numeric',
                'minEntryPrice' => 'required|numeric',
                'recommendedDuration' => 'required|string',
                'partners' => 'nullable', // Déclare partners comme étant un tableau
                'partners.*' => 'string', 
                'financingEligibility' => 'required|boolean',
                'isFeatured' => 'required|boolean',
                'images' => 'nullable|array', // Assurez-vous que c'est un tableau
                'images.*' => 'image|max:102400',
                'documents' => 'nullable|array', // Assurez-vous que c'est un tableau
                'documents.*' => 'file|max:102400', // Validation pour chaque fichier document
            ]); 
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }
        try {
                  // Convert partners to an array if it's a comma-separated string
        if (isset($validated['partners']) && is_string($validated['partners'])) {
            $partners = array_map('trim', explode(',', $validated['partners'])); // Split by commas and trim each item
        } else {
            $partners = $validated['partners'] ?? [];
        }
        // Créer un bien immobilier
        $property = new Property([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'price' => $validated['price'],
            'status' => $validated['status'],
            'location' => $validated['location'],
            'area' => $validated['area'],
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'description' => $validated['description'],
            'investmentType' => $validated['investmentType'],
            'projectStatus' => $validated['projectStatus'],
            'returnRate' => $validated['returnRate'],
            'minEntryPrice' => $validated['minEntryPrice'],
            'recommendedDuration' => $validated['recommendedDuration'],
            'partners' => json_encode($partners), // Store the partners as JSON
            'financingEligibility' => $validated['financingEligibility'],
            'isFeatured' => $validated['isFeatured'],
        ]);

 // Enregistrement des images
 $imagePaths = [];
 if ($request->hasFile('images')) {
     foreach ($request->file('images') as $image) {
        $path = $image->store('properties/images', 'spaces');
$imagePaths[] = Storage::disk('spaces')->url($path); // URL complète depuis le bucket

 // Utiliser storage/public pour l'accès public
     }
 }

 // Enregistrement des documents
 $documentPaths = [];
 if ($request->hasFile('documents')) {
     foreach ($request->file('documents') as $doc) {
       $path = $doc->store('properties/documents', 'spaces');
$documentPaths[] = Storage::disk('spaces')->url($path);

 // Utiliser storage/public pour l'accès public
     }
 }

 // Sauvegarder les chemins dans la base de données
 $property->images = json_encode($imagePaths);
 $property->documents = json_encode($documentPaths);
 //$property->partners = $partners;

 // Sauvegarder le bien immobilier
 $property->save();

    
            event(new ActivityLogged(
                'add_property',
                "Un nouveau bien à investir a été ajouté : {$property->title}.",
                Auth::check() ? Auth::id() : null // ✅ Utilisateur connecté ou null
            ));
 // Retourner une réponse JSON avec un message de succès

       return response()->json(['message' => 'Bien ajouté avec succès'], 201);
   } catch (\Exception $e) {
       // Gestion des erreurs côté serveur
       return response()->json([
           'message' => 'Erreur lors de l\'ajout du bien immobilier.',
           'error' => $e->getMessage()
       ], 500);
   }
    
}
//Get 
public function index(Request $request)
{
    $query = Property::query();

    // Filtrage par titre, emplacement, description
    if ($request->has('searchTerm') && $request->searchTerm) {
        $searchTerm = $request->searchTerm;
        $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%$searchTerm%")
                ->orWhere('location', 'like', "%$searchTerm%")
                ->orWhere('description', 'like', "%$searchTerm%");
        });
    }

    // Filtrage par taux de rentabilité
    if ($request->has('returnFilter') && $request->returnFilter != 'all') {
        $returnFilter = $request->returnFilter;
        if ($returnFilter == 'low') {
            $query->where('returnRate', '<=', 7);
        } elseif ($returnFilter == 'medium') {
            $query->whereBetween('returnRate', [7, 9]);
        } else {
            $query->where('returnRate', '>', 9);
        }
    }

    // Filtrage par type d'investissement
    if ($request->has('typeFilter') && $request->typeFilter != 'all') {
        $typeFilter = $request->typeFilter;
        $query->where('investmentType', $typeFilter);
    }

    // Filtrage par statut de projet
    if ($request->has('statusFilter') && $request->statusFilter != 'all') {
        $statusFilter = $request->statusFilter;
        $query->where('projectStatus', $statusFilter);
    }

    // Exécuter la requête et récupérer les résultats
    $properties = $query->get();
     
     // Transformer chaque propriété pour y inclure un objet 'investmentDetails'
     $propertiesWithInvestmentDetails = $properties->map(function ($property) {
        // Vérifier si partners est déjà un tableau
    $partners = is_array($property->partners) 
    ? $property->partners 
    : json_decode($property->partners, true) ?? [];
  // Vérifier si image est déjà un tableau
  $images = is_array($property->images) 
  ? $property->images 
  : json_decode($property->images, true) ?? [];


  $documents = is_array($property->documents) 
  ? $property->documents 
  : json_decode($property->documents, true) ?? [];

        $property->investmentDetails = [
            'title' =>$property->title,
            'type' => $property->type,
            'price' => $property->price,
            'status' => $property->status,
            'location' => $property->location,
            'area' =>  $property->area,
            'bedrooms' =>  $property->bedrooms,
            'bathrooms' =>  $property->bathrooms,
            'description' =>  $property->description,
            'investmentType' => $property->investmentType,
            'projectStatus' => $property->projectStatus,
            'returnRate' => $property->returnRate,
            'minEntryPrice' => $property->minEntryPrice,
            'recommendedDuration' => $property->recommendedDuration,
            'financingEligibility' =>  $property->financingEligibility,
            'isFeatured' =>  $property->isFeatured,
            'partners' => $partners,



        ];
$property->createdAt = $property->created_at
    ? $property->created_at->format('d/m/Y')
    : null;
// Envoyer les images au frontend
$property->images = $images;
$property->documents = $documents;


        return $property;
    });
// return response()->json($properties);
    return response()->json([
        'data' => $propertiesWithInvestmentDetails
    ]);
    
}
public function downloadDocument($propertyId, $documentIndex)
{
    try {
        $property = Property::findOrFail($propertyId);
        $documentsRaw = $property->documents;

        $documents = is_array($documentsRaw)
            ? $documentsRaw
            : json_decode($documentsRaw, true) ?? [];

        if (!isset($documents[$documentIndex])) {
            return response()->json(['error' => 'Document non trouvé'], 404);
        }

        $documentUrl = $documents[$documentIndex];

        // Extraire le chemin du fichier depuis l’URL publique
        $urlPrefix = 'https://universelle-images.lon1.cdn.digitaloceanspaces.com/';
        $path = str_replace($urlPrefix, '', $documentUrl);

        if (!Storage::disk('spaces')->exists($path)) {
            return response()->json(['error' => 'Fichier introuvable sur le bucket.'], 404);
        }

        // Récupérer le fichier depuis le bucket (en local temporaire)
        $stream = Storage::disk('spaces')->readStream($path);

        return response()->streamDownload(function () use ($stream) {
            fpassthru($stream);
        }, basename($path));

    } catch (\Exception $e) {
        \Log::error("Erreur téléchargement document depuis Spaces : " . $e->getMessage());
        return response()->json(['error' => 'Erreur serveur.'], 500);
    }
}


//show 
public function show($id)
{
    try {
        $property = Property::findOrFail($id);

        // Sécuriser le décodage JSON pour éviter les erreurs
        $property->partners = is_array($property->partners)
            ? $property->partners
            : json_decode($property->partners ?? '[]', true) ?? [];

        $property->images = is_array($property->images)
            ? $property->images
            : json_decode($property->images ?? '[]', true) ?? [];

        $property->documents = is_array($property->documents)
            ? $property->documents
            : json_decode($property->documents ?? '[]', true) ?? [];

        return response()->json([
            'data' => $property
        ], 200);

    } catch (\Exception $e) {
        \Log::error("Erreur show property: " . $e->getMessage());
        return response()->json([
            'message' => 'Erreur serveur.',
            'error' => $e->getMessage()
        ], 500);
    }
}

//update 
public function update(Request $request, $id)
{
    $property = Property::findOrFail($id);

    try {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric',
            'status' => 'required|string|in:Disponible,Réservé,Vendu',
            'location' => 'required|string',
            'area' => 'required|integer',
            'bedrooms' => 'required|integer',
            'bathrooms' => 'required|integer',
            'description' => 'required|string',
            'investmentType' => 'required|in:Résidentiel,Commercial,Touristique,Mixte',
            'projectStatus' => 'required|string',
            'returnRate' => 'nullable|numeric',
            'minEntryPrice' => 'required|numeric',
            'recommendedDuration' => 'required|string',
            'partners' => 'nullable|array',
            'partners.*' => 'string',
            'financingEligibility' => 'required|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:102400',
            'replace_images' => 'nullable|array',
            'replace_images.*' => 'image|max:102400',
            'documents' => 'nullable|array',
            'documents.*' => 'file|max:102400',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    }

    $partners = is_array($validated['partners'] ?? null)
        ? $validated['partners']
        : [];

    $existingImages = is_array($property->images)
        ? $property->images
        : json_decode($property->images ?? '[]', true) ?? [];

    $existingDocuments = is_array($property->documents)
        ? $property->documents
        : json_decode($property->documents ?? '[]', true) ?? [];

    // 📝 Mise à jour des champs
    $property->fill([
        'title' => $validated['title'],
        'type' => $validated['type'],
        'price' => $validated['price'],
        'location' => $validated['location'],
        'area' => $validated['area'],
        'bedrooms' => $validated['bedrooms'],
        'bathrooms' => $validated['bathrooms'],
        'description' => $validated['description'],
        'status' => $validated['status'],
        'investmentType' => $validated['investmentType'],
        'projectStatus' => $validated['projectStatus'],
        'returnRate' => $validated['returnRate'] ?? null,
        'minEntryPrice' => $validated['minEntryPrice'],
        'recommendedDuration' => $validated['recommendedDuration'],
        'partners' => json_encode($partners),
        'financingEligibility' => $validated['financingEligibility'],
    ]);

    // 🔁 1. Replace images if needed
    foreach ($request->allFiles() as $key => $file) {
        Log::debug("Analyse du fichier reçu : $key");

           if (preg_match('/^replace_images_(\d+)$/', $key, $matches)) {
    $index = (int) $matches[1];

    // Supprime l'ancienne si tu veux
    if (isset($existingImages[$index])) {
        $oldPath = str_replace('https://universelle-images.lon1.cdn.digitaloceanspaces.com/', '', $existingImages[$index]);
        Storage::disk('spaces')->delete($oldPath);
    }

    $storedPath = $file->store('properties/images', 'spaces');
    $existingImages[$index] = Storage::disk('spaces')->url($storedPath);
}
    }

    // ➕ 2. Add new images
   if ($request->hasFile('images')) {
    foreach ($request->file('images') as $file) {
        $storedPath = $file->store('properties/images', 'spaces');
        $existingImages[] = Storage::disk('spaces')->url($storedPath);
    }
}


    // ✅ Final save for images
    $property->images = json_encode(array_values($existingImages));

    // 🔁 Replace documents
    foreach ($request->allFiles() as $key => $file) {
        if (preg_match('/^replace_documents_(\d+)$/', $key, $matches)) {
            $index = (int) $matches[1];
            if (isset($existingDocuments[$index])) {
                $pathToDelete = str_replace('storage/', '', $existingDocuments[$index]);
                Storage::disk('public')->delete($pathToDelete);
            }
           $storedPath = $file->store('properties/documents', 'spaces');
$existingDocuments[] = Storage::disk('spaces')->url($storedPath);

        }
    }

    // ➕ Add new documents (max 2)
   if ($request->hasFile('documents')) {
    foreach ($request->file('documents') as $file) {
        if (count($existingDocuments) >= 2) break;
        $storedPath = $file->store('properties/documents', 'spaces');
        $existingDocuments[] = Storage::disk('spaces')->url($storedPath);
    }
}

    // ✅ Final save for documents
    $property->documents = json_encode(array_values($existingDocuments));

    // 💾 Save
    $property->save();
 // ✅ Journalisation de l'activité
 event(new ActivityLogged(
    'update_property',
    "Le bien à investir {$property->title} a été mis à jour.",
    Auth::check() ? Auth::id() : null
));

    return response()->json([
        'message' => 'Bien mis à jour',
        'data' => $property->fresh()
    ]);
}

//delete documents 

public function deleteDocumentAtIndex($id, $index)
{
    $property = Property::findOrFail($id);

    // S'assurer que documents est bien un tableau
    $documents = is_array($property->documents)
        ? $property->documents
        : json_decode($property->documents, true);

    // Vérifier l'existence de l'index demandé
    if (!isset($documents[$index])) {
        return response()->json(['message' => 'Document introuvable'], 404);
    }

    // Supprimer le fichier du disque
    $path = str_replace('storage/', '', $documents[$index]);
    if (Storage::disk('public')->exists($path)) {
        Storage::disk('public')->delete($path);
    }

    // Supprimer l'entrée du tableau
    array_splice($documents, $index, 1);
    $property->documents = $documents;
    $property->save();

    return response()->json(['message' => 'Document supprimé avec succès']);
}
//delete image 


public function deleteImageAtIndex($id, $index): JsonResponse
{
    $property = Property::findOrFail($id);

    $images = is_array($property->images)
        ? $property->images
        : json_decode($property->images ?? '[]', true);

    if (!isset($images[$index])) {
        return response()->json(['message' => 'Image introuvable à cet index.'], 404);
    }

    // Extraire le chemin relatif à partir de l'URL du bucket
    $urlPrefix = 'https://universelle-images.lon1.cdn.digitaloceanspaces.com/';
    $pathToDelete = str_replace($urlPrefix, '', $images[$index]);

    // Supprimer l'image du bucket DigitalOcean Spaces
    if (Storage::disk('spaces')->exists($pathToDelete)) {
        Storage::disk('spaces')->delete($pathToDelete);
    }

    // Supprimer l'entrée dans le tableau
    unset($images[$index]);
    $property->images = array_values($images); // Réindexer les clés
    $property->save();

    return response()->json([
        'message' => 'Image supprimée avec succès',
        'images' => $property->images,
    ]);
}


//delete bien a investir 
public function destroy($id)
{
    $property = Property::find($id);

    if (!$property) {
        return response()->json(['message' => 'Bien non trouvé'], 404);
    }

    // Supprimer les images liées
    $images = is_array($property->images) ? $property->images : json_decode($property->images ?? '[]', true);
    foreach ($images as $imgPath) {
        $relativePath = str_replace('storage/', '', $imgPath);
        \Storage::disk('public')->delete($relativePath);
    }

    // Supprimer les documents liés
    $documents = is_array($property->documents) ? $property->documents : json_decode($property->documents ?? '[]', true);
    foreach ($documents as $docPath) {
        $relativePath = str_replace('storage/', '', $docPath);
        \Storage::disk('public')->delete($relativePath);
    }
    $propertyTitle = $property->title;

    // Supprimer le bien
    $property->delete();
// ✅ Journalisation de l'activité
event(new ActivityLogged(
    'delete_property',
    "Le bien à investir {$propertyTitle} a été supprimé.",
    Auth::check() ? Auth::id() : null
));
    return response()->json(['message' => 'Bien supprimé avec succès'], 200);
}


}

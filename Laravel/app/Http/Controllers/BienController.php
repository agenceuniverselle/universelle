<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bien;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use App\Events\ActivityLogged;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

class BienController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3',
            'type' => 'required|string',
            'status' => 'required|string',
            'price' => 'required|string',
            'location' => 'required|string',
            'area' => 'required|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'description' => 'required|string|min:10',
            'is_featured' => 'boolean',
            'available_date' => 'nullable|date',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp',
            'documents.*' => 'mimes:pdf,doc,docx,xls,xlsx',
            'is_draft' => 'boolean',
    
            // Champs supplémentaires
            'construction_year' => 'nullable|string',
            'condition' => 'nullable|string',
            'exposition' => 'nullable|string',
            'cuisine' => 'nullable|string',
            'has_parking' => 'nullable|string',
            'parking_places' => 'nullable|string',
            'climatisation' => 'nullable|string',
            'terrasse' => 'nullable|string',
            'points_forts' => 'nullable|array',
            'points_forts.*' => 'string',
            'occupation_rate' => 'nullable|string',
            'estimated_valuation' => 'nullable|string',
            'estimated_charges' => 'nullable|string',
            'monthly_rent' => 'nullable|string',
            'quartier' => 'nullable|string',
            'proximite' => 'nullable|array',
            'proximite.*' => 'string',
            'map_link' => 'nullable|string',
            'owner_name' => 'nullable|string|max:255',
            'owner_email' => 'nullable|email|max:255',
            'owner_phone' => 'nullable|string|max:30',
            'owner_nationality' => 'nullable|string|max:100',
            'owner_documents.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:4096',



        ]);
    
        $bien = new Bien($validated);
    
        // Handle images
      // Handle images (stockage direct dans public/)
$imagePaths = [];

if ($request->hasFile('images')) {
    foreach ($request->file('images') as $image) {
        if (!$image || !$image->isValid()) continue;

        $extension = $image->getClientOriginalExtension();
        $filename = uniqid('img_', true) . '.' . $extension;

        // Utilisation de putFileAs pour avoir un retour booléen clair
        $success = Storage::disk('spaces')->putFileAs('Biens/images', $image, $filename);

        if ($success) {
            $url = Storage::disk('spaces')->url("Biens/images/$filename");
            logger('✅ Image enregistrée avec succès : ' . $url);
            $imagePaths[] = $url;
        } else {
            logger('❌ Échec de l’enregistrement de l’image : ' . $filename);
        }
    }
}

      // Handle documents
  $documentPaths = [];

if ($request->hasFile('documents')) {
    foreach ($request->file('documents') as $doc) {
        if (!$doc || !$doc->isValid()) continue;

        $filename = uniqid('doc_', true) . '.' . $doc->getClientOriginalExtension();
        $path = 'Biens/documents/' . $filename;

        $success = Storage::disk('spaces')->put($path, file_get_contents($doc), 'public');

        if ($success) {
            $documentPaths[] = Storage::disk('spaces')->url($path);
        }
    }
}

$bien->documents = array_values($documentPaths); // <-- utilise array_values ici aussi


    // Handle owner documents
    $ownerDocumentPaths = [];

    if ($request->hasFile('owner_documents')) {
        foreach ($request->file('owner_documents') as $doc) {
            $extension = $doc->getClientOriginalExtension();
            $filename = uniqid('owner_', true) . '.' . $extension;
            $path = 'Biens/owners/' . $filename;

            $success = Storage::disk('spaces')->put($path, file_get_contents($doc), 'public');

            if ($success) {
                $url = Storage::disk('spaces')->url($path);
                logger('✅ Doc propriétaire enregistré : ' . $url);
                $ownerDocumentPaths[] = $url;
            } else {
                logger('❌ Échec doc propriétaire : ' . $filename);
            }
        }
    }

        
        // Enregistrer dans la base (ex. si tu as une colonne JSON 'owner_documents')
        $bien->owner_documents = $ownerDocumentPaths;
        
        $bien->images = $imagePaths;
        $bien->documents = $documentPaths;
    
        $bien->save();
        event(new ActivityLogged(
            'add_bien',
            "Un nouveau bien immobilier a été ajouté : {$bien->title}.",
            Auth::check() ? Auth::id() : null // ✅ Utilisateur connecté ou null
        ));
        return response()->json([
            'message' => 'Bien créé avec succès',
            'data' => $bien
        ], 201);
    }
    

    //Affichage des biens
    public function index()
{
    $biens = Bien::where('is_draft', false)->get();

    return response()->json([
        'data' => $biens
    ]);
}
//show by id
public function show($id)
{
    $bien = Bien::find($id);

    if (!$bien) {
        return response()->json(['message' => 'Bien non trouvé'], 404);
    }

    return response()->json($bien);
}
//similaire meme type ou ville bien 
public function similaires($id)
{
    $bien = Bien::findOrFail($id);

    $similaires = Bien::where('id', '!=', $bien->id)
        ->where(function ($query) use ($bien) {
            $query->where('type', $bien->type)
                  ->orWhere('location', 'LIKE', '%' . explode(',', $bien->location)[0] . '%');
        })
        ->take(3)
        ->get();

    return response()->json($similaires);
}
//download doc
public function downloadDocument($id)
{
    $bien = Bien::findOrFail($id);
    $documents = $bien->documents;

    if (empty($documents) || !isset($documents[0])) {
        return response()->json(['error' => 'Aucun document disponible'], 404);
    }

    $fullUrl = $documents[0];

    // 🔥 Extraire seulement le chemin relatif à partir de l'URL
    $parsedPath = parse_url($fullUrl, PHP_URL_PATH); // /Biens/documents/doc_xxx.pdf
    $relativePath = ltrim($parsedPath, '/'); // Supprime le slash initial

    if (!Storage::disk('spaces')->exists($relativePath)) {
        return response()->json(['error' => 'Fichier introuvable sur Spaces'], 404);
    }

    return Storage::disk('spaces')->download($relativePath, 'Plan.pdf');
}


//edit bien 

public function update(Request $request, $id)
{
    $bien = Bien::findOrFail($id);

    $validated = $request->validate([
        'title' => 'required|string|min:3',
        'type' => 'required|string',
        'status' => 'required|string',
        'price' => 'required|string',
        'location' => 'required|string',
        'area' => 'nullable|string',
        'bedrooms' => 'nullable|integer',
        'bathrooms' => 'nullable|integer',
        'description' => 'nullable|string|min:10',
        'is_featured' => 'boolean',
        'available_date' => 'nullable|date',
        'construction_year' => 'nullable|string',
        'condition' => 'nullable|string',
        'exposition' => 'nullable|string',
        'cuisine' => 'nullable|string',
        'has_parking' => 'nullable|string',
        'parking_places' => 'nullable|string',
        'climatisation' => 'nullable|string',
        'terrasse' => 'nullable|string',
        'points_forts' => 'nullable|array',
        'points_forts.*' => 'string',
        'occupation_rate' => 'nullable|string',
        'estimated_valuation' => 'nullable|string',
        'estimated_charges' => 'nullable|string',
        'monthly_rent' => 'nullable|string',
        'quartier' => 'nullable|string',
        'proximite' => 'nullable|array',
        'proximite.*' => 'string',
        'map_link' => 'nullable|string',
        'owner_name' => 'nullable|string|max:255',
        'owner_email' => 'nullable|email|max:255',
        'owner_phone' => 'nullable|string|max:30',
        'owner_nationality' => 'nullable|string|max:100',
        'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        'replace_images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        'documents.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:4096',
        'replace_documents.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:4096',
        'owner_documents.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:4096',
        'replace_owner_documents.*' => 'mimes:pdf,doc,docx,xls,xlsx|max:4096',
    ]);

    $bien->fill($validated);

    // 🔄 Images existantes
    $existingImages = is_array($bien->images) ? $bien->images : [];

    if ($request->hasFile('replace_images')) {
        foreach ($request->file('replace_images') as $index => $file) {
            if (!$file || !$file->isValid()) continue;
            if (isset($existingImages[$index])) {
                $oldPath = ltrim(parse_url($existingImages[$index], PHP_URL_PATH), '/');
                Storage::disk('spaces')->delete($oldPath);
            }
            $filename = uniqid('img_', true) . '.' . $file->getClientOriginalExtension();
            $path = "Biens/images/$filename";
            Storage::disk('spaces')->put($path, file_get_contents($file), 'public');
            $existingImages[$index] = Storage::disk('spaces')->url($path);
        }
    }

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            if (!$file || !$file->isValid()) continue;
            $filename = uniqid('img_', true) . '.' . $file->getClientOriginalExtension();
            $path = "Biens/images/$filename";
            Storage::disk('spaces')->put($path, file_get_contents($file), 'public');
            $existingImages[] = Storage::disk('spaces')->url($path);
        }
    }

    $bien->images = array_values($existingImages);

    // 📄 Ajout de nouveaux documents
    $docPaths = is_array($bien->documents) ? $bien->documents : [];

    if ($request->hasFile('documents')) {
        foreach ($request->file('documents') as $file) {
            if (!$file || !$file->isValid()) continue;
            $filename = uniqid('doc_', true) . '.' . $file->getClientOriginalExtension();
            $path = "Biens/documents/$filename";
            Storage::disk('spaces')->put($path, file_get_contents($file), 'public');
            $docPaths[] = Storage::disk('spaces')->url($path);
        }
    }

    // 📄 Remplacement de documents par index
// 📄 Remplacement de documents par index
if ($request->hasFile('replace_documents')) {
    $files = $request->file('replace_documents');

    foreach ($files as $index => $file) {
        if (!$file || !$file->isValid()) continue;

        // Assurez-vous que $index est un entier
        $index = is_numeric($index) ? (int)$index : null;
        if ($index === null) continue;

        // Supprimer l'ancien document s'il existe
        if (isset($docPaths[$index]) && is_string($docPaths[$index])) {
            $oldPath = ltrim(parse_url($docPaths[$index], PHP_URL_PATH), '/');
            Storage::disk('spaces')->delete($oldPath);
        }

        // Upload du nouveau document
        $filename = uniqid('doc_', true) . '.' . $file->getClientOriginalExtension();
        $path = "Biens/documents/$filename";
        Storage::disk('spaces')->put($path, file_get_contents($file), 'public');

        // Remplacer proprement
        $docPaths[$index] = Storage::disk('spaces')->url($path);
    }
}

// Nettoyage final : suppression des entrées vides éventuelles
$bien->documents = array_values(array_filter($docPaths, fn($item) => is_string($item) && !empty($item)));


    $bien->documents = array_values(array_filter($docPaths, function ($val) {
    return is_string($val) && !empty($val);
}));


    // 👤 Documents propriétaire
    $ownerDocPaths = is_array($bien->owner_documents) ? $bien->owner_documents : [];

    if ($request->hasFile('owner_documents')) {
        foreach ($request->file('owner_documents') as $file) {
            if (!$file || !$file->isValid()) continue;
            $filename = uniqid('owner_', true) . '.' . $file->getClientOriginalExtension();
            $path = "Biens/owners/$filename";
            Storage::disk('spaces')->put($path, file_get_contents($file), 'public');
            $ownerDocPaths[] = Storage::disk('spaces')->url($path);
        }
    }

    if ($request->hasFile('replace_owner_documents')) {
        foreach ($request->file('replace_owner_documents') as $index => $file) {
            if (!$file || !$file->isValid()) continue;
            if (isset($ownerDocPaths[$index])) {
                $oldPath = ltrim(parse_url($ownerDocPaths[$index], PHP_URL_PATH), '/');
                Storage::disk('spaces')->delete($oldPath);
            }
            $filename = uniqid('owner_', true) . '.' . $file->getClientOriginalExtension();
            $path = "Biens/owners/$filename";
            Storage::disk('spaces')->put($path, file_get_contents($file), 'public');
            $ownerDocPaths[$index] = Storage::disk('spaces')->url($path);
        }
    }

    $bien->owner_documents = array_values($ownerDocPaths);

    $bien->save();

    event(new ActivityLogged(
        'update_bien',
        "Le bien immobilier {$bien->title} a été mis à jour.",
        Auth::check() ? Auth::id() : null
    ));

    return response()->json([
        'message' => 'Bien mis à jour avec succès',
        'data' => $bien->fresh()
    ]);
}



//delete image 
public function deleteImage($id, $index): JsonResponse
{
    $bien = Bien::findOrFail($id);

    $images = is_array($bien->images) ? $bien->images : [];

    if (!isset($images[$index])) {
        return response()->json([
            'message' => 'Image introuvable à cet index.'
        ], 404);
    }

    // Supprimer physiquement le fichier
    $pathToDelete = parse_url($images[$index], PHP_URL_PATH);
$pathToDelete = ltrim(str_replace('/' . env('DO_SPACES_BUCKET') . '/', '', $pathToDelete), '/');
Storage::disk('spaces')->delete($pathToDelete);


    // Supprimer l'entrée du tableau
    unset($images[$index]);

    // Réindexation propre
    $bien->images = array_values($images);
    $bien->save();

    return response()->json([
        'message' => 'Image supprimée avec succès',
        'data' => $bien->images
    ]);
}
//delete documents
public function deleteDocument($id)
{
    $bien = Bien::findOrFail($id);

    try {
        $documents = is_array($bien->documents) ? $bien->documents : [];

        foreach ($documents as $url) {
            if (empty($url) || !is_string($url)) continue;

            $path = ltrim(parse_url($url, PHP_URL_PATH), '/');

            if (Storage::disk('spaces')->exists($path)) {
                Storage::disk('spaces')->delete($path);
            }
        }

        // Vide correctement le champ documents
        $bien->documents = [];
        $bien->save();

        return response()->json(['message' => 'Document supprimé avec succès']);
    } catch (\Throwable $e) {
        \Log::error("Erreur suppression documents : " . $e->getMessage());
        return response()->json(['message' => 'Erreur serveur'], 500);
    }
}

//supprimer bien 
public function destroy($id)
{
    $bien = Bien::find($id);

    if (!$bien) {
        return response()->json(['message' => 'Bien non trouvé'], 404);
    }
    $bienTitle = $bien->title; // ✅ Récupérer le titre avant suppression

    $bien->delete();
// ✅ Journalisation de l'activité
event(new ActivityLogged(
    'delete_bien',
    "Le bien immobilier {$bienTitle} a été supprimé.",
    Auth::check() ? Auth::id() : null
));
    return response()->json(['message' => 'Bien supprimé avec succès'], 200);
}
//download owner document 
public function downloadOwnerDocument($id)
{
    $bien = Bien::findOrFail($id);
    $ownerDocs = $bien->owner_documents;

    if (empty($ownerDocs) || !isset($ownerDocs[0])) {
        return response()->json(['error' => 'Aucun document disponible'], 404);
    }

    $path = str_replace('storage/', '', $ownerDocs[0]);
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        return response()->json(['error' => 'Fichier introuvable'], 404);
    }

    return response()->download($fullPath, 'Document_proprietaire.pdf');
}
//documents delete
public function deleteOwnerDocumentByIndex($id, $index)
{
    $bien = Bien::findOrFail($id);
    $docs = $bien->owner_documents;

    if (!isset($docs[$index])) {
        return response()->json(['error' => 'Document non trouvé.'], 404);
    }

   $path = parse_url($docs[$index], PHP_URL_PATH);
$relativePath = ltrim($path, '/');
Storage::disk('spaces')->delete($relativePath);


    $bien->owner_documents = array_values($docs);
    $bien->save();

    return response()->json(['message' => 'Document du propriétaire supprimé avec succès.']);
}

}

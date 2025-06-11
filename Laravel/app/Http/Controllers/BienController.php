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
            $extension = $doc->getClientOriginalExtension();
            $filename = uniqid('doc_', true) . '.' . $extension;
            $path = 'Biens/documents/' . $filename;

            $success = Storage::disk('spaces')->put($path, file_get_contents($doc), 'public');

            if ($success) {
                $url = Storage::disk('spaces')->url($path);
                logger('✅ Document enregistré : ' . $url);
                $documentPaths[] = $url;
            } else {
                logger('❌ Échec du document : ' . $filename);
            }
        }
    }

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

    $url = $documents[0]; // URL complète depuis Spaces
    $path = ltrim(parse_url($url, PHP_URL_PATH), '/'); // Extrait le chemin S3
    
    // Vérifie si le fichier existe dans Spaces
    if (!Storage::disk('spaces')->exists($path)) {
        return response()->json(['error' => 'Fichier introuvable'], 404);
    }

    return Storage::disk('spaces')->download($path, 'Plan.pdf'); // force téléchargement
}

//edit bien 

public function update(Request $request, $id)
{
    $bien = Bien::findOrFail($id);

    // 🔒 Récupérer les images actuelles AVANT toute modification
    $existingImages = is_array($bien->images) ? $bien->images : [];

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
    ]);

    // Ensuite on peut modifier le bien avec les autres champs
    $bien->fill($validated);

    // 📷 Remplacer certaines images (par index)
   if ($request->hasFile('replace_images')) {
    foreach ($request->file('replace_images') as $index => $file) {
        if (!$file || !$file->isValid()) continue;

        // Supprimer ancienne image
        if (isset($existingImages[$index])) {
            $oldPath = public_path($existingImages[$index]);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

       $filename = time() . '_' . $file->getClientOriginalName();
$path = $file->storeAs('Biens/images', $filename, 'spaces');
$existingImages[$index] = Storage::disk('spaces')->url($path);

    }
}

    // 📷 Ajouter de nouvelles images (à la fin)
  if ($request->hasFile('images')) {
    $imagesToAdd = $request->file('images');
    if (!is_array($imagesToAdd)) {
        $imagesToAdd = [$imagesToAdd];
    }

    foreach ($imagesToAdd as $file) {
        if (!$file || !$file->isValid()) continue;

        $filename = time() . '_' . $file->getClientOriginalName();
$path = $file->storeAs('Biens/images', $filename, 'spaces');
$existingImages[] = Storage::disk('spaces')->url($path);


    }
}


    // ✅ Réindex propre
    $bien->images = array_values($existingImages);

    // 📄 Gestion des documents (1 seul autorisé)
if ($request->hasFile('documents')) {
    // Supprimer l'ancien s'il existe
    if (!empty($bien->documents) && is_array($bien->documents)) {
        foreach ($bien->documents as $oldPath) {
            $path = str_replace('storage/', '', $oldPath);
            Storage::disk('public')->delete($path);
        }
    }

    // Stocker le nouveau (1 seul max)
    $newDoc = $request->file('documents')[0] ?? null;
    if ($newDoc && $newDoc->isValid()) {
        $docPath = $newDoc->store('Biens/documents', 'public');
        $bien->documents = ['storage/' . $docPath];
    }
}

// Remplacement de documents propriétaires (optionnel, à adapter selon ton front)
// 📄 Remplacer documents propriétaires individuellement
if ($request->hasFile('replace_owner_documents')) {
    $replacedDocs = $request->file('replace_owner_documents');
    $existingOwnerDocs = is_array($bien->owner_documents) ? $bien->owner_documents : [];

    foreach ($replacedDocs as $index => $file) {
        if (!$file || !$file->isValid()) continue;

        // Supprimer l'ancien fichier depuis Spaces
        if (isset($existingOwnerDocs[$index])) {
            $urlPath = parse_url($existingOwnerDocs[$index], PHP_URL_PATH);
            $path = ltrim($urlPath, '/');
            Storage::disk('spaces')->delete($path);
        }

        $originalName = $file->getClientOriginalName();
        $sanitizedName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
        $path = $file->storeAs('Biens/owners', $sanitizedName, 'spaces');

        $existingOwnerDocs[$index] = Storage::disk('spaces')->url($path);
    }

    $bien->owner_documents = array_values($existingOwnerDocs);
}


// 📄 Ajouter de nouveaux documents propriétaires
if ($request->hasFile('owner_documents')) {
    $ownerDocs = $request->file('owner_documents');
    $existingOwnerDocs = is_array($bien->owner_documents) ? $bien->owner_documents : [];

    foreach ($ownerDocs as $file) {
        if (!$file || !$file->isValid()) continue;

        $originalName = $file->getClientOriginalName();
        $sanitizedName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
        $path = $file->storeAs('Biens/owners', $sanitizedName, 'spaces');

        $existingOwnerDocs[] = Storage::disk('spaces')->url($path);
    }

    $bien->owner_documents = array_values($existingOwnerDocs);
}




    // 💾 Sauvegarde finale
    $bien->save();
// ✅ Journalisation de l'activité
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

   if (!empty($bien->documents) && is_array($bien->documents)) {
    foreach ($bien->documents as $url) {
        $urlPath = parse_url($url, PHP_URL_PATH);
        $path = ltrim($urlPath, '/');
        Storage::disk('spaces')->delete($path);
    }
}


    $bien->documents = [];
    $bien->save();

    return response()->json(['message' => 'Document supprimé avec succès']);
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

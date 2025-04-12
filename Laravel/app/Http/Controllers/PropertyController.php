<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image; // Importer la bibliothèque Intervention Image
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\File;
class PropertyController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validation des données du formulaire
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|in:Appartement,Villa,Maison,Riad,Bureau,Commerce,Terrain,Immeuble,Complexe,Autre',
                'price' => 'required|numeric',
                'status' => 'required|in:Disponible,Réservé,Vendu',
                'location' => 'required|string',
                'area' => 'required|integer',
                'bedrooms' => 'required|integer',
                'bathrooms' => 'required|integer',
                'description' => 'required|string',
                'investmentType' => 'required|in:Résidentiel,Commercial,Touristique',
                'projectStatus' => 'required|in:Pré-commercialisation,En cours,Terminé',
                'returnRate' => 'nullable|numeric',
                'minEntryPrice' => 'required|numeric',
                'recommendedDuration' => 'required|string',
                'partners' => 'nullable', // Déclare partners comme étant un tableau
                'partners.*' => 'string', 
                'financingEligibility' => 'required|boolean',
                'isFeatured' => 'required|boolean',
                'images' => 'nullable|array', // Assurez-vous que c'est un tableau
                'images.*' => 'file|mimes:jpeg,jpg,png,gif,webp|max:102400',
                'documents' => 'nullable|array', // Assurez-vous que c'est un tableau
                'documents.*' => 'file|mimes:pdf,doc,docx|max:102400', // Validation pour chaque fichier document
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
         $path = $image->store('public/images');
         $imagePaths[] = str_replace('public/', 'storage/', $path); // Utiliser storage/public pour l'accès public
     }
 }

 // Enregistrement des documents
 $documentPaths = [];
 if ($request->hasFile('documents')) {
     foreach ($request->file('documents') as $doc) {
         $path = $doc->store('public/documents');
         $documentPaths[] = str_replace('public/', 'storage/', $path); // Utiliser storage/public pour l'accès public
     }
 }

 // Sauvegarder les chemins dans la base de données
 $property->images = json_encode($imagePaths);
 $property->documents = json_encode($documentPaths);
 //$property->partners = $partners;

 // Sauvegarder le bien immobilier
 $property->save();
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
        $property->createdAt = $property->created_at->format('d/m/Y ');
// Envoyer les images au frontend
$property->images = $images;
$property->documents = $documents;


        return $property;
    });

    return response()->json($properties);
}
public function downloadDocument($propertyId, $documentIndex)
{
    $property = Property::findOrFail($propertyId);
    $documents = json_decode($property->documents, true);

    Log::info("Documents array:", $documents);
    Log::info("Requested index: " . $documentIndex);

    // Vérification de l'existence du document à l'index donné
    $documentPath = $documents[$documentIndex] ?? null;

    if (!$documentPath) {
        Log::error("Document not found at index: " . $documentIndex);
        return response()->json(['error' => 'Invalid document index'], 404);
    }

    $relativePath = str_replace('storage/', '', $documentPath);
    $absolutePath = storage_path('app/public/' . $relativePath);

    // Vérification si le fichier existe réellement
    if (!file_exists($absolutePath)) {
        Log::error("File not found at path: " . $absolutePath);
        return response()->json(['error' => 'File not found at path: ' . $relativePath], 404);
    }

    // Liste des noms personnalisés pour les fichiers
    $customNames = [
        0 => 'Brochure complète.pdf',
        1 => 'Plans détaillés.pdf',
        // ajoute plus de noms si nécessaire ici
    ];

    // Nom de téléchargement par défaut si l'index n'est pas dans le tableau
    $downloadName = $customNames[$documentIndex] ?? basename($absolutePath);

    Log::info("File will be downloaded as: " . $downloadName);

    return response()->download($absolutePath, $downloadName);
}

}



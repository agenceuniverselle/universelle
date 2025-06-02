<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    // Récupération de tous les projets
  public function index(): JsonResponse
{
    try {
        $projects = Project::all()->map(function ($project) {
            // Handle images field - could be JSON string, array, or null
            $images = $project->images;
            
            if (is_string($images)) {
                $images = json_decode($images, true) ?? [];
            } 
            
            if (!is_array($images)) {
                $images = [];
            }

            return [
                'id' => $project->id,
                'name' => $project->name,
                'details' => $project->details,
                'location' => $project->location,
                'type' => $project->type,
                'surface' => $project->surface,
                'status' => $project->status,
                'images' => array_map(
                    fn($image) => asset('storage/' . str_replace('\\', '/', $image)), 
                    $images
                ),
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
            ];
        });

        return response()->json($projects);
    } catch (\Exception $e) {
        Log::error('Error loading projects: ' . $e->getMessage());
        return response()->json([
            'message' => 'Erreur lors du chargement des projets',
            'error' => $e->getMessage()
        ], 500);
    }
}
    // Création d’un nouveau projet
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type'     => 'nullable|string|max:255',
            'details'  => 'nullable|string',
            'surface'  => 'nullable|string',
            'status'   => 'nullable|string',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('projects', 'public');
            }
        }

        $project = Project::create([
            ...$validated,
            'images' => json_encode($images),
        ]);

        return response()->json(['message' => 'Projet créé', 'project' => $project], 201);
    }

  public function update(Request $request, $id)
{
    $project = Project::find($id);
    
    if (!$project) {
        return response()->json(['message' => 'Projet non trouvé'], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'location' => 'required|string|max:255',
        'type' => 'nullable|string|max:255',
        'details' => 'nullable|string',
        'surface' => 'nullable|string',
        'status' => 'nullable|string',
        'images.*' => 'nullable|image|max:2048',
        'existing_images' => 'nullable|array',
    ]);

    // Normaliser les chemins d'accès existants
    $existingImages = json_decode($project->images, true) ?? [];
    $existingImages = array_map(function($path) {
        return str_replace('\\', '/', $path);
    }, $existingImages);

    // Gérer les images existantes
    $imagesToKeep = $request->existing_images ?? $existingImages;
    $imagesToKeep = array_map(function($path) {
        // Supprimer l'URL asset() si présent
        if (strpos($path, 'storage/') !== false) {
            $parts = explode('storage/', $path);
            return 'projects/'.basename(end($parts));
        }
        return str_replace('\\', '/', $path);
    }, $imagesToKeep);

    // Ajouter les nouvelles images
    $newImages = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $newImages[] = $file->store('projects', 'public');
        }
    }

    // Fusionner et normaliser tous les chemins
    $allImages = array_merge($imagesToKeep, $newImages);
    $allImages = array_map(function($path) {
        return str_replace('\\', '/', $path);
    }, $allImages);

    $project->update([
        ...$validated,
        'images' => json_encode($allImages),
    ]);

    // Formater la réponse
    $updatedProject = Project::find($project->id);
    $formattedImages = array_map(
        fn($image) => asset('storage/'.str_replace('\\', '/', $image)), 
        json_decode($updatedProject->images, true) ?? []
    );

    return response()->json([
        'message' => 'Projet mis à jour avec succès',
        'project' => [
            'id' => $updatedProject->id,
            'name' => $updatedProject->name,
            'details' => $updatedProject->details,
            'location' => $updatedProject->location,
            'type' => $updatedProject->type,
            'surface' => $updatedProject->surface,
            'status' => $updatedProject->status,
            'images' => $formattedImages,
            'created_at' => $updatedProject->created_at,
            'updated_at' => $updatedProject->updated_at,
        ]
    ], 200);
}
    // Affichage d’un seul projet
    public function show(Project $project): JsonResponse
    {
        try {
            return response()->json($project);
        } catch (\Exception $e) {
            Log::error('Error showing project: ' . $e->getMessage());

            return response()->json([
                'message' => 'Projet non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Suppression d’un projet
   public function destroy($id): JsonResponse
{
    try {
        $project = Project::find($id);
        
        if (!$project) {
            return response()->json([
                'message' => 'Projet non trouvé'
            ], 404);
        }

        $images = json_decode($project->images, true);

        if (is_array($images)) {
            foreach ($images as $imagePath) {
                $cleanPath = str_replace('storage/', '', $imagePath);
                if (Storage::disk('public')->exists($cleanPath)) {
                    Storage::disk('public')->delete($cleanPath);
                }
            }
        }

        $project->delete();

        return response()->json([
            'message' => 'Projet supprimé avec succès!'
        ], 200);

    } catch (\Exception $e) {
        Log::error('Error deleting project: ' . $e->getMessage());
        return response()->json([
            'message' => 'Erreur lors de la suppression du projet',
            'error' => $e->getMessage()
        ], 500);
    }
}
}

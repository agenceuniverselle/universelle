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
               'images' => $images,
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
        'images.*' => 'nullable|mimes:jpeg,jpg,png,webp|max:2048',

    ]);

    $imageUrls = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $filename = uniqid('proj_', true) . '.' . $image->getClientOriginalExtension();
            $path = "Projects/images/$filename";

            $success = Storage::disk('spaces')->put($path, file_get_contents($image), 'public');

            if ($success) {
                $imageUrls[] = Storage::disk('spaces')->url($path);
            }
        }
    }

    $project = Project::create([
        ...$validated,
        'images' => json_encode($imageUrls),
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

    $existing = json_decode($project->images, true) ?? [];

    // 🧹 Nettoyer les images à conserver
    $keep = array_map(function ($path) {
        $parsed = parse_url($path, PHP_URL_PATH);
        return ltrim($parsed, '/'); // clean URL to path
    }, $request->input('existing_images', []));

    // Supprimer celles à enlever
    foreach ($existing as $oldUrl) {
        $parsed = parse_url($oldUrl, PHP_URL_PATH);
        $rel = ltrim($parsed, '/');
        if (!in_array($rel, $keep)) {
            Storage::disk('spaces')->delete($rel);
        }
    }

    $finalImages = array_map(function ($path) {
    return Storage::disk('spaces')->url($path);
}, $keep);


    // 📤 Ajouter les nouvelles
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            if (!$image->isValid()) continue;
            $filename = uniqid('proj_', true) . '.' . $image->getClientOriginalExtension();
            $path = "Projects/images/$filename";
            $success = Storage::disk('spaces')->put($path, file_get_contents($image), 'public');
            if ($success) {
                $finalImages[] = Storage::disk('spaces')->url($path);
            }
        }
    }

    $project->update([
        ...$validated,
        'images' => json_encode($finalImages),
    ]);

    return response()->json(['message' => 'Projet mis à jour avec succès', 'project' => $project]);
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

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ConseillerContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConseillerContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255', // Validation pour le champ 'name'
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
            'propertyId' => 'nullable|integer|exists:properties,id',
            'consent'    => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contact = ConseillerContact::create([
                'name' => $request->name, // Utilise directement 'name'
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => $request->message,
                'property_id' => $request->propertyId,
                'status' => 'new',
                'consent'     => $request->consent,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Votre demande a été envoyée avec succès. Un conseiller vous contactera bientôt.',
                'data' => $contact
            ], 201);

        } catch (\Exception | \Error $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'enregistrement de votre demande.',
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

/**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $demandes = ConseillerContact::latest()->get(); // Récupère toutes les demandes, les plus récentes en premier
            return response()->json($demandes, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes de contact.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

 

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $demande = ConseillerContact::findOrFail($id); // Trouve la demande par son ID, ou échoue
            return response()->json($demande, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de contact introuvable.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la demande de contact.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $demande = ConseillerContact::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255',
                'phone' => 'sometimes|required|string|max:20',
                'message' => 'sometimes|required|string',
                'propertyId' => 'sometimes|nullable|integer|exists:properties,id',
                'status' => 'sometimes|required|string|in:new,in_progress,completed,archived',
                'consent'    => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $demande->update($request->all()); // Met à jour tous les champs envoyés

            return response()->json([
                'success' => true,
                'message' => 'Demande de contact mise à jour avec succès.',
                'data' => $demande
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de contact introuvable.'
            ], 404);
        } catch (\Exception | \Error $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la mise à jour de la demande.',
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $demande = ConseillerContact::findOrFail($id);
            $demande->delete();

            return response()->json([
                'success' => true,
                'message' => 'Demande de contact supprimée avec succès.'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de contact introuvable.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la demande de contact.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
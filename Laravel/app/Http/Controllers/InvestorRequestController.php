<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InvestorRequest;

class InvestorRequestController extends Controller
{
    public function store($id, Request $request) // <-- $id doit venir en premier ici
    {
        \Log::info('Received property ID: ' . $id);

    // Check if the request contains all necessary data
    \Log::info('Request data: ', $request->all());
        $validated = $request->validate([
            'montant_investissement' => 'required|string',
            'type_participation' => 'required|string',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'required|string|max:20',
            'nationalite' => 'required|string',
            'adresse' => 'required|string',
            'methode_paiement' => 'required|string',
            'piece_identite' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'justificatif_domicile' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'releve_bancaire' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $paths = [];

        foreach (['piece_identite', 'justificatif_domicile', 'releve_bancaire'] as $field) {
            if ($request->hasFile($field)) {
                $paths[$field] = $request->file($field)->store('investor_docs', 'public');
            }
        }

        $investorRequest = InvestorRequest::create([
            'property_id' => $id, // <-- ici on utilise l'id reçu depuis la route
            'montant_investissement' => $validated['montant_investissement'],
            'type_participation' => $validated['type_participation'],
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'nationalite' => $validated['nationalite'],
            'adresse' => $validated['adresse'],
            'methode_paiement' => $validated['methode_paiement'],
            'piece_identite' => $paths['piece_identite'] ?? null,
            'justificatif_domicile' => $paths['justificatif_domicile'] ?? null,
            'releve_bancaire' => $paths['releve_bancaire'] ?? null,
        ]);

        return response()->json([
            'message' => 'Demande enregistrée avec succès',
            'data' => $investorRequest,
        ]);
    }
}

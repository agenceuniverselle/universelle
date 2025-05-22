<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id(); // ID du bien
            $table->string('title');  // Titre du bien
            $table->string('type');
            $table->decimal('price', 15, 2);  // Prix du bien en MAD
            $table->enum('status', ['Disponible', 'Réservé','Vendu']);  // Statut du bien
            $table->string('location');  // Localisation du bien
            $table->integer('area');  // Superficie en m²
            $table->integer('bedrooms');  // Nombre de chambres
            $table->integer('bathrooms');  // Nombre de salles de bain
            $table->text('description');  // Description détaillée du bien
            $table->enum('investmentType', ['Résidentiel', 'Commercial','Touristique']);   // Type d'investissement (résidentiel, commercial, etc.)
            $table->enum('projectStatus', ['Pré-commercialisation', 'En cours', 'Terminé']);  // Statut du projet
            $table->decimal('returnRate', 5, 2)->nullable();  // Rentabilité estimée
            $table->decimal('minEntryPrice', 15, 2);  // Prix d'entrée minimal en MAD
            $table->string('recommendedDuration');  // Durée d'investissement recommandée
            $table->json('partners')->nullable();  // Liste des partenaires sous forme de JSON
            $table->boolean('financingEligibility')->default(false);  // Éligibilité aux financements
            $table->boolean('isFeatured')->default(false);  // Bien en vedette (Switch)
              // Champs pour les images (stockage des fichiers image sous forme de JSON)
            $table->json('images')->nullable();  // Liste des chemins d'images liées à la propriété
            
              // Champs pour les documents (stockage des fichiers document sous forme de JSON)
            $table->json('documents')->nullable();  // Liste des chemins de documents associés à la propriété
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};

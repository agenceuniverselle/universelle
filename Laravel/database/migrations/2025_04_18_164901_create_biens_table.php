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
        Schema::create('biens', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->string('status');
            $table->string('price');
            $table->string('location');
            $table->string('area');
            $table->unsignedInteger('bedrooms')->nullable();
            $table->unsignedInteger('bathrooms')->nullable();
            $table->text('description');
            $table->boolean('is_featured')->default(false);
            $table->date('available_date')->nullable();
            $table->json('images')->nullable();
            $table->json('documents')->nullable();
            $table->boolean('is_draft')->default(true);
            
            // Nouveaux champs ajoutés
            $table->string('construction_year')->nullable();
            $table->string('condition')->nullable();
            $table->string('exposition')->nullable();
            $table->string('cuisine')->nullable();
            $table->string('has_parking')->nullable();
            $table->string('parking_places')->nullable();
            $table->string('climatisation')->nullable();
            $table->string('terrasse')->nullable();
            $table->json('points_forts')->nullable();
            $table->string('occupation_rate')->nullable();
            $table->string('estimated_valuation')->nullable();
            $table->string('estimated_charges')->nullable();
            $table->string('monthly_rent')->nullable();
            $table->string('quartier')->nullable();
            $table->json('proximite')->nullable();
            $table->text('map_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biens');
    }
};

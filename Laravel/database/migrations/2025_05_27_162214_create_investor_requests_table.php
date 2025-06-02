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
        Schema::create('investor_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('property_id')
              ->nullable()
              ->constrained()
              ->onDelete('cascade');
        $table->string('montant_investissement');
        $table->string('type_participation');
        $table->string('prenom');
        $table->string('nom');
        $table->string('email');
        $table->string('telephone');
        $table->string('nationalite');
        $table->text('commentaire')->nullable();
        $table->boolean('consent')->default(true); // Add this line for the consent field
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investor_requests');
    }
};

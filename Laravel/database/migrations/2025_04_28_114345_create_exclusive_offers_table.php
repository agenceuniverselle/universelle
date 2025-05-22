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
        Schema::create('exclusive_offers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id'); // bien associé
            $table->decimal('current_value', 15, 2); // valeur actuelle en MAD
            $table->decimal('monthly_rental_income', 15, 2); // revenu locatif mensuel en MAD
            $table->decimal('annual_growth_rate', 5, 2); // % de croissance
            $table->integer('duration_years'); // durée d'investissement
            $table->decimal('initial_investment', 15, 2); // 💥 montant investi initial
            $table->timestamps();
            
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exclusive_offers');
    }
};

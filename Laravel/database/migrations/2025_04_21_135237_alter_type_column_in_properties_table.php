<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('type')->change(); // Convertit l'énumération en champ texte
        });
    }
    
    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->enum('type', ['Appartement', 'Villa','Maison','Riad','Bureau','Commerce','Terrain','Immeuble','Complexe','Autre'])->change();
        });
    }
    
};

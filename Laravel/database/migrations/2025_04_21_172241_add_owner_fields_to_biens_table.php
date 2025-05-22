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
        Schema::table('biens', function (Blueprint $table) {
            //Schema::table('biens', function (Blueprint $table) {
        $table->string('owner_name')->nullable();
        $table->string('owner_email')->nullable();
        $table->string('owner_phone')->nullable();
        $table->string('owner_nationality')->nullable();
    });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biens', function (Blueprint $table) {
            //
        });
    }
};

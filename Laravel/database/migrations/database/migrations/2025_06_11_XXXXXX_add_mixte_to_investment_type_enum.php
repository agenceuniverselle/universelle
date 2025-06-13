<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE properties MODIFY COLUMN investmentType ENUM('Résidentiel', 'Commercial', 'Touristique', 'Mixte') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE properties MODIFY COLUMN investmentType ENUM('Résidentiel', 'Commercial', 'Touristique') NOT NULL");
    }
};

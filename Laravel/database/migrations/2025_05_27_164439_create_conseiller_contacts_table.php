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
        Schema::create('conseiller_contacts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('property_id')->nullable()->constrained()->onDelete('cascade');
    $table->string('name');
    $table->string('email');
    $table->string('phone')->nullable();
    $table->text('message');
    $table->enum('status', ['new', 'in_progress', 'completed', 'archived'])->default('new');
    $table->boolean(column: 'consent')->default(true);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conseiller_contacts');
    }
};

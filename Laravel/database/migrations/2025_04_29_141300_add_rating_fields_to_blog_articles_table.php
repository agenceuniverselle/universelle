<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_articles', function (Blueprint $table) {
            $table->float('rating')->nullable()->after('similar_links'); // moyenne des notes
            $table->unsignedInteger('rating_count')->default(0)->after('rating'); // nombre de votes
        });
    }

    public function down(): void
    {
        Schema::table('blog_articles', function (Blueprint $table) {
            $table->dropColumn(['rating', 'rating_count']);
        });
    }
};

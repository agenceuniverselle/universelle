<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogArticle extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'excerpt',
        'category',
        'author',
        'author_type',        
        'author_function',
        'similar_links',
        'rating',          
        'rating_count',
    ];

    protected $casts = [
        'similar_links' => 'array',
    ];
    public function comments()
{
    return $this->hasMany(Comment::class);
}

}

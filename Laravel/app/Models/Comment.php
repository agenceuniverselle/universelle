<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'blog_article_id',
        'first_name',
        'last_name',
        'email',
        'content',
        'parent_id', // ✅ obligatoire pour l'enregistrement

    ];

    public function article()
    {
        return $this->belongsTo(BlogArticle::class, 'blog_article_id');
    }


public function parent()
{
    return $this->belongsTo(Comment::class, 'parent_id');
}
public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with(['replies', 'reactions']);
        // 👆 on ajoute 'reactions' ici pour que les réponses aient aussi leurs réactions
    }

    public function reactions()
    {
        return $this->hasMany(CommentReaction::class);
    }


}

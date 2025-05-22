<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
   // GET /api/blogs/{id}/comments
   public function showComments($id)
{
    try {
        $comments = Comment::where('blog_article_id', $id)
    ->whereNull('parent_id')
    ->with(['replies.replies.replies', 'replies.reactions', 'reactions'])
    ->latest()
    ->get();


        // Ajouter les comptes de réactions à chaque commentaire
        $comments = $comments->map(function ($comment) {
            return $this->withReactionCounts($comment);
        });

        return response()->json($comments);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}

private function withReactionCounts($comment)
{
    $comment->reaction_counts = $comment->reactions
        ->groupBy('reaction')
        ->map(fn($group) => $group->count());

    // Appliquer la même chose récursivement aux replies
    if ($comment->relationLoaded('replies')) {
        $comment->replies = $comment->replies->map(function ($reply) {
            return $this->withReactionCounts($reply);
        });
    }

    return $comment;
}

// POST /api/blogs/{id}/comments
public function store(Request $request, $id)
{
    $validated = $request->validate([
        'first_name' => 'required|string|min:2',
        'last_name' => 'required|string|min:2',
        'email' => 'required|email',
        'content' => 'required|string|min:5',
        'parent_id' => ['nullable', 'sometimes', 'exists:comments,id']

    ]);

    $comment = Comment::create([
        ...$validated,
        'blog_article_id' => $id,
    ]);

    return response()->json($comment, 201);
}

 // GET /api/comments - Récupérer tous les commentaires
    public function getAllComments() {
        try {
            $comments = Comment::with(['replies', 'reactions'])
                ->latest()
                ->get();
                
            // Ajouter les comptes de réactions à chaque commentaire
            $comments = $comments->map(function ($comment) {
                return $this->withReactionCounts($comment);
            });
            
            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // DELETE /api/comments/{id}
    public function deleteComment($id) {
        try {
            $comment = Comment::findOrFail($id);
            $comment->delete();
            
            return response()->json(['message' => 'Commentaire supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

   

}

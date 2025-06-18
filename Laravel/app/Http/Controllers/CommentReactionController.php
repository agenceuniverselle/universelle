<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CommentReaction;
use App\Models\Comment; 

use App\Models\Notification; 

class CommentReactionController extends Controller
{
    public function toggleReaction(Request $request, $commentId)
{
    $validated = $request->validate([
        'reaction' => 'required|string|max:10',
    ]);

    // 🔍 On vérifie si une réaction identique existe déjà
    $existing = CommentReaction::where('comment_id', $commentId)
        ->where('reaction', $validated['reaction'])
        ->first();

    if ($existing) {
        $existing->delete();
        return response()->json(['message' => 'Réaction supprimée']);
    }

    CommentReaction::create([
        'comment_id' => $commentId,
        'reaction' => $validated['reaction'],
    ]);
      // ✅ On récupère le commentaire associé
        $comment = Comment::find($commentId);

        if ($comment) {
            Notification::create([
                'type' => 'reaction',
                'content' => "👍 Nouvelle réaction « {$validated['reaction']} » sur le commentaire de {$comment->first_name} {$comment->last_name} ({$comment->email})",
            ]);
        }

    return response()->json(['message' => 'Réaction ajoutée']);
}
}

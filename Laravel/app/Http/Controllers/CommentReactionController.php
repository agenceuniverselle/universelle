<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CommentReaction;

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

    return response()->json(['message' => 'Réaction ajoutée']);
}
}

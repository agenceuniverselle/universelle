<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlogArticle;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use App\Events\ActivityLogged;

class BlogArticleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3',
            'excerpt' => 'required|string|min:10',
            'category' => 'required|string',
            'author_type' => 'required|string|in:interne,externe',
            'author' => 'required|string',
            'author_function' => 'nullable|string',
            'similar_links' => 'nullable|array',
            'similar_links.*' => 'url',
        ]);
    
        // ⚙️ Appliquer les valeurs automatiquement si interne
        if ($validated['author_type'] === 'interne') {
            $validated['author'] = 'Agence Universelle';
            $validated['author_function'] = 'Expert Immobilier';
        }
    
        // Nettoyage HTML du contenu
        $validated['excerpt'] = strip_tags(
            $validated['excerpt'],
            '<p><br><h1><h2><h3><h4><h5><h6><img><blockquote><ul><ol><li><b><strong><i><em><u><a><pre><code><span><div><address>'
        );
    
        $article = BlogArticle::create($validated);
       // ✅ Journalisation de l'ajout
       event(new ActivityLogged(
        'create_blog_article',
        "Un nouvel article a été créé : {$article->title}.",
        Auth::check() ? Auth::id() : null
    ));
        return response()->json([
            'message' => 'Article créé avec succès',
            'data' => $article
        ], 201);
    }
//rate method
public function rate(Request $request, $id)
{
    $request->validate([
        'rating' => 'required|numeric|min:1|max:5',
    ]);

    $article = BlogArticle::findOrFail($id);

    // 🧠 Calcul de la nouvelle moyenne
    $currentTotal = ($article->rating ?? 0) * ($article->rating_count ?? 0);
    $newRatingCount = ($article->rating_count ?? 0) + 1;
    $newAverage = ($currentTotal + $request->rating) / $newRatingCount;

    // 🔄 Mise à jour
    $article->rating = round($newAverage, 2);
    $article->rating_count = $newRatingCount;
    $article->save();

    return response()->json([
        'message' => 'Note enregistrée avec succès',
        'rating' => $article->rating,
        'rating_count' => $article->rating_count,
    ]);
}



//get blog 
public function index()
{
    $articles = BlogArticle::orderBy('created_at', 'desc')->get();

    // Optionnel : calcul du read time et image automatiquement côté backend
    $articles = $articles->map(function ($article) {
        // Calcul approximatif du temps de lecture
        $plainText = strip_tags($article->excerpt);
        $wordCount = str_word_count($plainText);
        $readTime = ceil($wordCount / 200) . ' min';

        // Récupérer la première image du contenu HTML
        preg_match('/<img[^>]+src="([^">]+)"/i', $article->excerpt, $matches);
        $firstImage = $matches[1] ?? null;

        return [
            'id' => $article->id,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
            'category' => $article->category,
            'author' => $article->author,
            'author_function' => $article->author_function, // ✅ ajouté ici
            'date' => $article->created_at->format('d F Y'),
            'image' => $firstImage,
            'rating' => $article->rating ?? 0,
            'rating_count' => $article->rating_count ?? 0,
        ];
    });

    return response()->json($articles);
}
//article similaires 
public function similaires($id)
{
    $article = BlogArticle::findOrFail($id);

    $similarArticles = BlogArticle::where('id', '!=', $article->id)
        ->where('category', $article->category)
        ->orderBy('created_at', 'desc')
        ->take(4)
        ->get()
        ->map(function ($item) {
            // Récupérer la première image
            preg_match('/<img[^>]+src="([^">]+)"/i', $item->excerpt, $matches);
            $firstImage = $matches[1] ?? null;

            return [
                'id' => $item->id,
                'title' => $item->title,
                'excerpt' => $item->excerpt,
                'category' => $item->category,
                'author' => $item->author,
                'author_function' => $item->author_function,
                'date' => $item->created_at->format('d F Y'),
                'image' => $firstImage,
               
            ];
        });

    return response()->json($similarArticles);
}

public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp,avif|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $filename = uniqid('blog_', true) . '.' . $file->getClientOriginalExtension();
        $path = "Blog/images/$filename";

        $success = \Storage::disk('spaces')->put($path, file_get_contents($file), 'public');

        if ($success) {
            return response()->json([
                'url' => \Storage::disk('spaces')->url($path)
            ]);
        }

        return response()->json(['error' => 'Échec de l\'upload'], 500);
    }

    return response()->json(['error' => 'Aucun fichier trouvé'], 400);
}

public function show($id)
{
    $blog = BlogArticle::findOrFail($id);
    return response()->json($blog);
}

//delete blog
public function destroy($id)
{
    $article = BlogArticle::findOrFail($id);
    $title = $article->title; // ✅ Conserver le titre avant suppression

    $article->delete();
  // ✅ Journalisation de la suppression
  event(new ActivityLogged(
    'delete_blog_article',
    "L'article a été supprimé : {$title}.",
    Auth::check() ? Auth::id() : null
));
    return response()->json(['message' => 'Article supprimé avec succès.']);
}
//update 
public function update(Request $request, $id)
{
    $article = BlogArticle::findOrFail($id);

    $validated = $request->validate([
        'title' => 'required|string|min:3',
        'excerpt' => 'required|string|min:10',
        'category' => 'required|string',
        'author_type' => 'required|in:interne,externe',
        'author' => 'required|string',
        'author_function' => 'nullable|string',
        'similar_links' => 'nullable|array',
        'similar_links.*' => 'url',
    ]);

    if ($validated['author_type'] === 'interne') {
        $validated['author'] = 'Agence Universelle';
        $validated['author_function'] = 'Expert Immobilier';
    }

    // Nettoyage HTML (conserve les balises autorisées)
    $validated['excerpt'] = strip_tags(
        $validated['excerpt'],
        '<p><br><h1><h2><h3><h4><h5><h6><img><blockquote><ul><ol><li><b><strong><i><em><u><a><pre><code><span><div><address>'
    );

    $article->update($validated);
 // ✅ Journalisation de la mise à jour
 event(new ActivityLogged(
    'update_blog_article',
    "L'article a été mis à jour : {$article->title}.",
    Auth::check() ? Auth::id() : null
));
    return response()->json([
        'message' => 'Article mis à jour avec succès',
        'data' => $article,
    ]);
}

}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Events\ActivityLogged;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(Testimonial::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fonction' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('testimonials', 'public');
        }

        $testimonial = Testimonial::create($validated);
 // ✅ Journalisation de l'ajout
 event(new ActivityLogged(
    'create_testimonial',
    "Un nouveau témoignage a été ajouté : {$testimonial->name}.",
    Auth::check() ? Auth::id() : null
));
        return response()->json([
            'message' => 'Témoignage ajouté avec succès',
            'data' => $testimonial,
        ], 201);
    }
    public function show($id)
{
    $testimonial = Testimonial::find($id);

    if (!$testimonial) {
        return response()->json(['message' => 'Témoignage non trouvé'], 404);
    }

    return response()->json($testimonial);
}


public function update(Request $request, $id)
{
    $testimonial = Testimonial::find($id);

    if (!$testimonial) {
        return response()->json(['message' => 'Témoignage non trouvé'], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'fonction' => 'nullable|string|max:255',
        'quote' => 'required|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    // ✅ Si on remplace l’image
    if ($request->hasFile('image')) {
        if ($testimonial->image && Storage::disk('public')->exists($testimonial->image)) {
            Storage::disk('public')->delete($testimonial->image);
        }

        $validated['image'] = $request->file('image')->store('testimonials', 'public');
    }

    // ✅ Si on veut juste supprimer l’image existante sans en ajouter une
    if ($request->has('remove_image') && $testimonial->image) {
        if (Storage::disk('public')->exists($testimonial->image)) {
            Storage::disk('public')->delete($testimonial->image);
        }
        $testimonial->image = null;
    }

    $testimonial->update($validated);
  // ✅ Journalisation de la mise à jour
  event(new ActivityLogged(
    'update_testimonial',
    "Le témoignage de {$testimonial->name} a été mis à jour.",
    Auth::check() ? Auth::id() : null
));
    return response()->json([
        'message' => 'Témoignage mis à jour avec succès',
        'data' => $testimonial->fresh()
    ]);
}
//delete image by id 
public function deleteImage($id)
{
    $testimonial = Testimonial::find($id);

    if (!$testimonial) {
        return response()->json(['message' => 'Témoignage non trouvé.'], 404);
    }

    if ($testimonial->image && Storage::disk('public')->exists($testimonial->image)) {
        Storage::disk('public')->delete($testimonial->image);
        $testimonial->image = null;
        $testimonial->save();

        return response()->json(['message' => 'Image supprimée avec succès.']);
    }

    return response()->json(['message' => 'Aucune image à supprimer.'], 400);
}
//delete testimonial 
public function destroy($id)
{
    $testimonial = Testimonial::find($id);

    if (!$testimonial) {
        return response()->json(['message' => 'Témoignage non trouvé'], 404);
    }

    // Supprimer l'image associée s'il y en a une
    if ($testimonial->image && \Storage::disk('public')->exists($testimonial->image)) {
        \Storage::disk('public')->delete($testimonial->image);
    }

    $testimonial->delete();
// ✅ Journalisation de la suppression
event(new ActivityLogged(
    'delete_testimonial',
    "Le témoignage de {$testimonial->name} a été supprimé.",
    Auth::check() ? Auth::id() : null
));
    return response()->json(['message' => 'Témoignage supprimé avec succès']);
}

}

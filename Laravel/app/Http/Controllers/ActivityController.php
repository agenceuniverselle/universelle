<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $search = $request->query('search', '');
        $date = $request->query('date', '');

        // ✅ Charger les activités avec les informations de l'utilisateur
        $activities = Activity::with('user') // Charger les informations de l'utilisateur
            ->when($search, function ($query) use ($search) {
                $query->where('type', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    });
            })
            ->when($date, function ($query) use ($date) {
                $query->whereDate('created_at', $date);
            })
            ->latest()
            ->paginate($limit);

        // ✅ Mapper les activités avec les informations de l'utilisateur
        $activities->getCollection()->transform(function ($activity) {
            return [
                'id' => $activity->id,
                'type' => $activity->type,
                'description' => $activity->description,
                'user_id' => $activity->user_id,
                'user_name' => $activity->user ? $activity->user->name : 'Utilisateur inconnu',
                'created_at' => $activity->created_at,
            ];
        });

        return response()->json($activities);
    }
    public function latestThree()
    {
        $activities = Activity::with('user')
            ->latest()
            ->take(3) // ✅ Limite à trois
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->type,
                    'description' => $activity->description,
                    'user_id' => $activity->user_id,
                    'user_name' => $activity->user ? $activity->user->name : 'Utilisateur inconnu',
                    'created_at' => $activity->created_at,
                ];
            });

        return response()->json($activities);
    }
}

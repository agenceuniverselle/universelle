<?php

namespace App\Listeners;

use App\Events\ActivityLogged;
use App\Models\Activity;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogActivityListener
{
    /**
     * Gérer l'événement.
     *
     * @param  ActivityLogged  $event
     * @return void
     */
    public function handle(ActivityLogged $event)
    {
        // Enregistrer l'activité dans la base de données
        Activity::create([
            'type' => $event->type,
            'description' => $event->description,
            'user_id' => $event->userId,
        ]);
    }
}

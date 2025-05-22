<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ActivityLogged
{
    use Dispatchable, SerializesModels;

    public string $type;
    public string $description;
    public ?int $userId;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param string $type
     * @param string $description
     * @param int|null $userId
     */
    public function __construct(string $type, string $description, ?int $userId = null)
    {
        $this->type = $type;
        $this->description = $description;
        $this->userId = $userId;
    }
}

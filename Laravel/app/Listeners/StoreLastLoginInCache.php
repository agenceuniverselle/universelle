namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Cache;

class StoreLastLoginInCache
{
    /**
     * Gère l'événement de connexion
     */
    public function handle(Login $event)
    {
        $user = $event->user;

        // Stocke la date de connexion pendant 7 jours (modifiable)
        Cache::put("last_login_user_{$user->id}", now()->toDateTimeString(), now()->addDays(7));
    }
}

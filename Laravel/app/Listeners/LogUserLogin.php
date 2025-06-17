namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Cache;

class LogUserLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        // Stocker la dernière connexion dans le cache pour 7 jours
        Cache::put("last_login_user_{$user->id}", now()->toDateTimeString(), now()->addDays(7));
    }
}

<?php

namespace App\Listeners\Reverb;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Laravel\Reverb\Events\ConnectionPruned;
class PrunedConnectionLestiner
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ConnectionPruned $event): void
    {
        
    }
}

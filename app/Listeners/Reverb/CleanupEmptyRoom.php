<?php

namespace App\Listeners\Reverb;

use App\Services\GameServices\GameInstance\IGameInstanceService;
use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Events\ChannelRemoved;

class CleanupEmptyRoom
{
    /**
     * Create the event listener.
     */
    public function __construct(private IGameInstanceService $gameInstanceService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ChannelRemoved $event): void
    {
        $channelName = $event->channel->name();
        if (str_contains($channelName, 'presence-room.')) {
            $roomId = str_replace('presence-room.', '', $channelName);
            $this->gameInstanceService->cancelRoom($roomId);
            Log::info("room with id:{$roomId} Removed");
        }
    }
}

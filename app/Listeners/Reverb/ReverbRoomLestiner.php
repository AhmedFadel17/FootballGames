<?php

namespace App\Listeners\Reverb;

use App\Services\GameServices\GameInstance\IGameInstanceService;
use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Events\MessageReceived;

class ReverbRoomLestiner
{
    public function __construct(private IGameInstanceService $gameInstanceService)
    {
        //
    }

    public function handle(MessageReceived $event): void
    {
        $payload = json_decode($event->message, true);

        if (isset($payload['event']) && $payload['event'] === 'pusher:unsubscribe') {


            $data = is_string($payload['data']) ? json_decode($payload['data'], true) : $payload['data'];

            $userId = (int)$event->connection->identifier();
            $channelName = $data['channel'] ?? null;
            Log::info("Event Data => Channel: {$channelName} ,User: {$userId}");

            // if ($userId && $channelName && str_contains($channelName, 'presence-room.')) {
            //     $roomId = str_replace('presence-room.', '', $channelName);
            //     $this->gameInstanceService->removeMember($roomId, $userId);
            //     Log::info("Pusher Internal: User {$userId} is being removed from room {$roomId}");
            // }
        }
    }
}

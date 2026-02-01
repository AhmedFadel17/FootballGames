<?php

namespace App\Http\Controllers\Game;

use App\Http\Controllers\Controller;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Shared\Enums\GameStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReverbWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $events = $request->input('events', []);
        $e=count($events);
        Log::info("A7aaaaaaaaaaaaaaaa {$e}");

        foreach ($events as $event) {
            $channel = $event['channel'];
            $instanceId = $this->extractInstanceId($channel);

            if (!$instanceId) continue;

            if ($event['name'] === 'member_removed') {
                $userId = $event['user_id'];
                $this->removeUserEntry($instanceId, $userId);
            }

            if ($event['name'] === 'channel_vacated') {
                $this->cancelInstanceIfEmpty($instanceId);
            }
        }

        return response()->json(['status' => 'success']);
    }

    private function removeUserEntry($instanceId, $userId)
    {
        GameEntry::where('game_instance_id', $instanceId)
            ->where('user_id', $userId)
            ->delete();

        Log::info("User {$userId} entry removed from Instance {$instanceId} via Webhook.");
    }

    private function extractInstanceId($channel)
    {
        if (preg_match('/presence-room\.(\d+)/', $channel, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function cancelInstanceIfEmpty($instanceId)
    {
        $instance = GameInstance::find($instanceId);

        if ($instance && $instance->status === GameStatus::PENDING) {
            $instance->update(['status' => GameStatus::CANCELLED]);
            Log::info("Game Instance {$instanceId} cancelled via Webhook (Channel Vacated).");
        }
    }
}

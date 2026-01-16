<?php
namespace App\DTOs\GamesList\GuessThePlayer;

use Illuminate\Http\Request;

readonly class CreateGuessThePlayerGameDto
{

    public function __construct(
        public string $playerCount,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            playerCount: $data['players_count'],
        );
    }

    public function toArray(): array
    {
        return [
            'players_count' => $this->playerCount,
        ];
    }
}

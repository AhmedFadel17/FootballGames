<?php

namespace App\DTOs\GamesList\TopList;

use App\DTOs\Gameslist\TopList;
use App\Shared\Enums\TopListItemstype;

class TopListGameDTO
{
    public function __construct(
        public int $gameId,
        public string $title,
        public int $size,
        public int $maxChances,
        public TopListItemstype $type,
        /** @var int[] */
        public array $items,
    ) {}

    /**
     * Build DTO from validated request data
     */
    public static function fromRequest(array $data): self
{
    return new self(
        gameId: $data['game_id'],
        title: $data['title'],
        size: $data['size'],
        maxChances: $data['max_chances'],
        type: TopListItemstype::from($data['type']),
        items: array_map(fn($item) => [
            'id'  => $item['id'],
            'pos' => $item['pos'],
        ], $data['items'])
    );
}

}

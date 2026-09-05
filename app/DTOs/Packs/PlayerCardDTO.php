<?php
namespace App\DTOs\Packs;

use App\Enums\Packs\CardRarity;
use Illuminate\Foundation\Http\FormRequest;

class PlayerCardDTO
{
    public function __construct(
        public ?int $playerId = null,
        public ?int $eventId = null,
        public ?int $rarity = null,
        public ?int $rating = null,
        public ?string $imgSrc = null,
        public ?bool $isPackable = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            playerId: isset($data['player_id']) ? (int) $data['player_id'] : null,
            eventId: isset($data['event_id']) ? (int) $data['event_id'] : null,
            rarity: isset($data['rarity']) ? (int) $data['rarity'] : null,
            rating: isset($data['rating']) ? (int) $data['rating'] : null,
            imgSrc: $data['img_src'] ?? null,
            isPackable: isset($data['is_packable']) ? (bool) $data['is_packable'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'player_id' => $this->playerId,
            'event_id' => $this->eventId,
            'rarity' => $this->rarity,
            'rating' => $this->rating,
            'img_src' => $this->imgSrc,
            'is_packable' => $this->isPackable,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
<?php

namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class PackDropRuleDTO
{
    public function __construct(
        public ?int $packId = null,
        public ?string $dropType = null,
        public ?int $rarity = null,
        public ?int $eventId = null,
        public ?int $minCoins = null,
        public ?int $maxCoins = null,
        public ?float $dropPercentage = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            packId: isset($data['pack_id']) ? (int) $data['pack_id'] : null,
            dropType: $data['drop_type'] ?? null,
            rarity: isset($data['rarity']) ? (int) $data['rarity'] : null,
            eventId: isset($data['event_id']) ? (int) $data['event_id'] : null,
            minCoins: isset($data['min_coins']) ? (int) $data['min_coins'] : null,
            maxCoins: isset($data['max_coins']) ? (int) $data['max_coins'] : null,
            dropPercentage: isset($data['drop_percentage']) ? (float) $data['drop_percentage'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'pack_id' => $this->packId,
            'drop_type' => $this->dropType,
            'rarity' => $this->rarity,
            'event_id' => $this->eventId,
            'min_coins' => $this->minCoins,
            'max_coins' => $this->maxCoins,
            'drop_percentage' => $this->dropPercentage,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
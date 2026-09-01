<?php
namespace App\DTOs\GamesList\Grid;


use Illuminate\Foundation\Http\FormRequest;

class GridConditionDTO
{
    public function __construct(
        public ?int $gridGameId = null,
        public ?int $objectId = null,
        public ?string $objectType = null,
        public ?int $connectionType = null,
        public ?int $type = null,
        public ?int $pos = null,
    ) {
    }


    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            gridGameId: isset($data['grid_game_id']) ? (int) $data['grid_game_id'] : null,
            objectId: isset($data['object_id']) ? (int) $data['object_id'] : null,
            objectType: isset($data['object_type']) ? $data['object_type'] : null,
            connectionType: isset($data['connection_type']) ? (int) $data['connection_type'] : null,
            type: isset($data['type']) ? (int) $data['type'] : null,
            pos: isset($data['pos']) ? (int) $data['pos'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'grid_game_id' => $this->gridGameId,
            'object_id' => $this->objectId,
            'object_type' => $this->objectType,
            'connection_type' => $this->connectionType,
            'type' => $this->type,
            'pos' => $this->pos,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
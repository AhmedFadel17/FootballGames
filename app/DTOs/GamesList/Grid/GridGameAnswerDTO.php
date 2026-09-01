<?php
namespace App\DTOs\GamesList\Grid;


use App\Enums\GamesList\GridCellType;
use Illuminate\Foundation\Http\FormRequest;

class GridGameAnswerDTO
{
    public function __construct(
        public ?int $playerId = null,
        public ?int $row = null,
        public ?int $col = null,
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
            row: isset($data['row']) ? (int) $data['row'] : null,
            col: isset($data['col']) ? (int) $data['col'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'player_id' => $this->playerId,
            'row' => $this->row,
            'col' => $this->col,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
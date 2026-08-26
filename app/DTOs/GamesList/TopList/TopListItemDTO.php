<?php
namespace App\DTOs\GamesList\TopList;


use Illuminate\Foundation\Http\FormRequest;

class TopListItemDTO
{
    public function __construct(
        public ?int $objectId = null,
        public ?int $rank = null,
        public ?string $displayValue = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            objectId: isset($data['object_id']) ? (int) $data['object_id'] : null,
            rank: isset($data['rank']) ? (int) $data['rank'] : null,
            displayValue: isset($data['display_value']) ? (string) $data['display_value'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'object_id' => $this->objectId,
            'rank' => $this->rank,
            'display_value' => $this->displayValue,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
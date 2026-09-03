<?php
namespace App\DTOs\GamesList\Bingo;


use Illuminate\Foundation\Http\FormRequest;

class BingoGameDTO
{
    public function __construct(
        public ?int $size = null,
        public ?int $difficulty = null,
        public ?int $totalAnswers = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            size: isset($data['size']) ? (int) $data['size'] : null,
            difficulty: isset($data['difficulty']) ? (int) $data['difficulty'] : null,
            totalAnswers: isset($data['total_answers']) ? (int) $data['total_answers'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'size' => $this->size,
            'difficulty' => $this->difficulty,
            'total_answers' => $this->totalAnswers,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
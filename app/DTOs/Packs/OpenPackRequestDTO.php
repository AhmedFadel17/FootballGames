<?php

namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class OpenPackRequestDTO
{
    public function __construct(
        public int $userId,
        public int $packId,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            packId: (int) $data['pack_id'],
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'pack_id' => $this->packId,
        ];
    }
}
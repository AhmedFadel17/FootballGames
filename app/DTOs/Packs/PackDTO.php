<?php
namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class PackDTO
{
    public function __construct(
        public ?string $slug = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?int $priceCoins = null,
        public ?int $cardsCount = null,
        public ?int $requiredLevel = null,
        public ?int $userLimit = null,
        public ?string $limitType = null,
        public ?string $imgSrc = null,
        public ?bool $isActive = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            slug: $data['slug'] ?? null,
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            priceCoins: isset($data['price_coins']) ? (int) $data['price_coins'] : null,
            cardsCount: isset($data['cards_count']) ? (int) $data['cards_count'] : null,
            requiredLevel: isset($data['required_level']) ? (int) $data['required_level'] : null,
            userLimit: isset($data['user_limit']) ? (int) $data['user_limit'] : null,
            limitType: $data['limit_type'] ?? null,
            imgSrc: $data['img_src'] ?? null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'price_coins' => $this->priceCoins,
            'cards_count' => $this->cardsCount,
            'required_level' => $this->requiredLevel,
            'user_limit' => $this->userLimit,
            'limit_type' => $this->limitType,
            'img_src' => $this->imgSrc,
            'is_active' => $this->isActive,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
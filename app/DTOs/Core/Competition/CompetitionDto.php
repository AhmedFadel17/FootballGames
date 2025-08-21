<?php

namespace App\DTOs\Core\Competition;

class CompetitionDTO
{
    public string $name;
    public ?string $short_name;
    public ?int $country_id;
    public ?string $type;
    public ?int $founded_year;
    public ?int $tier;
    public ?string $img_src;
    public int $popularity;
    public bool $is_active;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->short_name = $data['short_name'] ?? null;
        $this->country_id = $data['country_id'] ?? null;
        $this->type = $data['type'] ?? null;
        $this->founded_year = $data['founded_year'] ?? null;
        $this->tier = $data['tier'] ?? null;
        $this->img_src = $data['img_src'] ?? null;
        $this->is_active = $data['is_active'] ?? true;
        $this->popularity = $data['popularity'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'short_name' => $this->short_name,
            'country_id' => $this->country_id,
            'type' => $this->type,
            'founded_year' => $this->founded_year,
            'tier' => $this->tier,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'is_active' => $this->is_active,
        ];
    }
} 
<?php

namespace App\DTOs\Core\Team;

class TeamDTO
{
    public string $name;
    public ?string $short_name;
    public ?string $abbr;
    public ?string $img_src;
    public ?int $api_id;
    public ?int $country_id;
    public int $popularity;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->short_name = $data['short_name'] ?? null;
        $this->abbr = $data['abbr'] ?? null;
        $this->img_src = $data['img_src'] ?? null;
        $this->api_id = $data['api_id'] ?? null;
        $this->country_id = $data['country_id'] ?? null;
        $this->popularity = $data['popularity'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'short_name' => $this->short_name,
            'abbr' => $this->abbr,
            'img_src' => $this->img_src,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
            'popularity' => $this->popularity,
        ];
    }
} 
<?php

namespace App\DTOs\Core\Player;
class PlayerDTO
{
    public string $name;
    public ?string $fullname;
    public string $position;
    public ?string $date_of_birth;
    public ?string $img_src;
    public ?int $popularity;
    public ?int $api_id;
    public ?int $country_id;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->fullname = $data['fullname'] ?? null;
        $this->position = $data['position'];
        $this->date_of_birth = $data['date_of_birth'] ?? null;
        $this->img_src = $data['img_src'] ?? null;
        $this->popularity = $data['popularity'] ?? null;
        $this->api_id = $data['api_id'] ?? null;
        $this->country_id = $data['country_id'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'fullname' => $this->fullname,
            'position' => $this->position,
            'date_of_birth' => $this->date_of_birth,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
        ];
    }
}

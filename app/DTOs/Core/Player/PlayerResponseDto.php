<?php

namespace App\DTOs\Core\Player;

use App\DTOs\Core\Country\CountryResponseDTO;
use App\Models\Core\Player;

class PlayerResponseDTO
{
    public int $id;
    public string $name;
    public ?string $fullname;
    public string $position;
    public ?string $img_src;
    public ?string $date_of_birth;
    public ?int $popularity;
    public ?int $api_id;
    public ?int $country_id;
    public ?CountryResponseDTO $country;

    public function __construct(Player $player)
    {
        $this->id = $player->id;
        $this->name = $player->name;
        $this->fullname = $player->fullname;
        $this->position = $player->position;
        $this->date_of_birth = $player->date_of_birth;
        $this->img_src = $player->img_src;
        $this->popularity = $player->popularity;
        $this->api_id = $player->api_id;
        $this->country_id = $player->country_id;
        $this->country = $player->country ? new CountryResponseDTO($player->country) : null;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'fullname' => $this->fullname,
            'position' => $this->position,
            'date_of_birth' => $this->date_of_birth,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
            'country' => $this->country,
        ];
    }
}

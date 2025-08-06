<?php

namespace App\DTOs\Core\Player;

use App\Models\Core\Player;

class PlayerResponseDTO
{
    public int $id;
    public string $name;
    public string $position;
    public ?string $date_of_birth;
    public ?int $country_id;

    public function __construct(Player $player)
    {
        $this->id = $player->id;
        $this->name = $player->name;
        $this->position = $player->position;
        $this->date_of_birth = $player->date_of_birth;
        $this->country_id = $player->country_id;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'position' => $this->position,
            'date_of_birth' => $this->date_of_birth,
            'country_id' => $this->country_id,
        ];
    }
}

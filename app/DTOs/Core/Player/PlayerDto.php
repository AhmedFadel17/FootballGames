<?php

namespace App\DTOs\Core\Player;
class PlayerDTO
{
    public string $name;
    public string $position;
    public ?string $date_of_birth;
    public ?int $country_id;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->position = $data['position'];
        $this->date_of_birth = $data['date_of_birth'] ?? null;
        $this->country_id = $data['country_id'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'position' => $this->position,
            'date_of_birth' => $this->date_of_birth,
            'country_id' => $this->country_id,
        ];
    }
}

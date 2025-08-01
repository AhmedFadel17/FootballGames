<?php

namespace App\DTOs\Core\Manager;

class ManagerDTO
{
    public string $name;
    public ?string $nationality;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->nationality = $data['nationality'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'nationality' => $this->nationality,
        ];
    }
} 
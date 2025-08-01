<?php

namespace App\DTOs\Core\Manager;

use App\Models\Core\Manager;

class ManagerResponseDTO
{
    public int $id;
    public string $name;
    public ?string $nationality;

    public function __construct(Manager $manager)
    {
        $this->id = $manager->id;
        $this->name = $manager->name;
        $this->nationality = $manager->nationality;
    }
} 
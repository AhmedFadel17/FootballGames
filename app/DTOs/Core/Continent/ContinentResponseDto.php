<?php

namespace App\DTOs\Core\Continent;

use App\Models\Core\Continent;

class ContinentResponseDTO
{
    public int $id;
    public string $name;
    public string $code;

    public function __construct(Continent $continent)
    {
        $this->id = $continent->id;
        $this->name = $continent->name;
        $this->code = $continent->code;
    }
} 
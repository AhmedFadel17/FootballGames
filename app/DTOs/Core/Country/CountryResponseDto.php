<?php

namespace App\DTOs\Core\Country;

use App\Models\Core\Country;

class CountryResponseDTO
{
    public int $id;
    public string $name;
    public string $code;
    public ?int $continent_id;

    public function __construct(Country $country)
    {
        $this->id = $country->id;
        $this->name = $country->name;
        $this->code = $country->code;
        $this->continent_id = $country->continent_id;
    }
} 
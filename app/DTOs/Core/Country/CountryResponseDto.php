<?php

namespace App\DTOs\Core\Country;

use App\Models\Core\Country;

class CountryResponseDTO
{
    public int $id;
    public string $name;
    public string $code;
    public int $popularity;
    public ?int $continent_id;
    public ?string $img_src;

    public function __construct(Country $country)
    {
        $this->id = $country->id;
        $this->name = $country->name;
        $this->code = $country->code;
        $this->popularity = $country->popularity;
        $this->continent_id = $country->continent_id;
        $this->img_src = $country->img_src;

    }
} 
<?php

namespace App\DTOs\Core\Competition;

use App\DTOs\Core\Country\CountryResponseDTO;
use App\Models\Core\Competition;

class CompetitionResponseDTO
{
    public int $id;
    public string $name;
    public ?string $short_name;
    public ?int $country_id;
    public ?string $type;
    public ?int $founded_year;
    public ?int $tier;
    public ?string $img_src;
    public bool $is_active;
    public int $popularity;
    public ?CountryResponseDTO $country;

    public function __construct(Competition $competition)
    {
        $this->id = $competition->id;
        $this->name = $competition->name;
        $this->short_name = $competition->short_name;
        $this->country_id = $competition->country_id;
        $this->type = $competition->type;
        $this->founded_year = $competition->founded_year;
        $this->tier = $competition->tier;
        $this->img_src = $competition->img_src;
        $this->is_active = $competition->is_active;
        $this->popularity = $competition->popularity;
        $this->country = $competition->country ? new CountryResponseDTO($competition->country) : null;
    }
}

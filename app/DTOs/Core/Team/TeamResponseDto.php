<?php

namespace App\DTOs\Core\Team;

use App\DTOs\Core\Country\CountryResponseDTO;
use App\Models\Core\Team;

class TeamResponseDTO
{
    public int $id;
    public string $name;
    public ?string $short_name;
    public ?string $abbr;
    public ?string $img_src;
    public ?int $api_id;
    public ?int $country_id;
    public ?CountryResponseDTO $country;
    public int $popularity;

    public function __construct(Team $team)
    {
        $this->id = $team->id;
        $this->name = $team->name;
        $this->short_name = $team->short_name;
        $this->abbr = $team->abbr;
        $this->img_src = $team->img_src;
        $this->api_id = $team->api_id;
        $this->country_id = $team->country_id;
        $this->popularity = $team->popularity;
        $this->country = $team->country ? new CountryResponseDTO($team->country) : null;
    }
}

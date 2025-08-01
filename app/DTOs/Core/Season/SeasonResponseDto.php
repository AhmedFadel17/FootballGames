<?php

namespace App\DTOs\Core\Season;

use App\Models\Core\Season;

class SeasonResponseDTO
{
    public int $id;
    public string $name;
    public int $start_year;
    public int $end_year;

    public function __construct(Season $season)
    {
        $this->id = $season->id;
        $this->name = $season->name;
        $this->start_year = $season->start_year;
        $this->end_year = $season->end_year;
    }
} 
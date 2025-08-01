<?php

namespace App\DTOs\Core\Season;

class SeasonDTO
{
    public string $name;
    public int $start_year;
    public int $end_year;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->start_year = $data['start_year'];
        $this->end_year = $data['end_year'];
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'start_year' => $this->start_year,
            'end_year' => $this->end_year,
        ];
    }
} 
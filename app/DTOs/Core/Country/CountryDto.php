<?php

namespace App\DTOs\Core\Country;

class CountryDTO
{
    public string $name;
    public string $code;
    public ?int $continent_id;
    public int $popularity;
    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->code = $data['code'];
        $this->popularity= $data['popularity'];
        $this->continent_id = $data['continent_id'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'popularity'=>$this->popularity,
            'continent_id' => $this->continent_id,
        ];
    }
} 
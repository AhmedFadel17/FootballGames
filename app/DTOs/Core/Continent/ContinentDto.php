<?php

namespace App\DTOs\Core\Continent;

class ContinentDTO
{
    public string $name;
    public string $code;

    public function __construct(array $data)
    {
        $this->name = $data['name'];
        $this->code = $data['code'];
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
        ];
    }
} 
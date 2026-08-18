<?php

namespace App\Resources\Shared;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LookupResource extends JsonResource
{
    protected string $labelKey;
    protected string $valueKey;
    protected ?array $extraFields;

    /**
     * @param mixed $resource
     * @param string $valueKey
     * @param string $labelKey
     * @param array|null $extraFields
     */
    public function __construct($resource, string $valueKey = 'id', string $labelKey = 'name', ?array $extraFields = null)
    {
        parent::__construct($resource);
        $this->valueKey = $valueKey;
        $this->labelKey = $labelKey;
        $this->extraFields = $extraFields;
    }


    public static function collectionWith($resource, string $valueKey = 'id', string $labelKey = 'name', ?array $extraFields = null)
    {
        return collect($resource)->map(
            fn($item) => new static($item, $valueKey, $labelKey, $extraFields)
        );
    }

    public function toArray(Request $request): array
    {
        $data = [
            'value' => data_get($this->resource, $this->valueKey),
            'label' => data_get($this->resource, $this->labelKey),
        ];

        if ($this->extraFields) {
            foreach ($this->extraFields as $field) {
                $data[$field] = data_get($this->resource, $field);
            }
        }

        return $data;
    }
}
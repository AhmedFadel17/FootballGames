<?php
namespace App\Http\Requests\Packs\Event;

use App\Http\Requests\Shared\BaseFilterRequest;

class EventFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'slug',
            'name',
            'is_active',
            'start_date',
            'end_date',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ];
    }
}
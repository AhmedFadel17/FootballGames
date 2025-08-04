<?php

namespace App\Http\Requests\Game\GameInstance;

use Illuminate\Foundation\Http\FormRequest;

class GameInstanceFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'sort_by' => 'nullable|string|in:game_id,start_at,end_at,status,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
            'game_id' => 'nullable|integer|exists:games,id',
            'status' => 'nullable|string|in:active,inactive,completed,cancelled',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'page' => $this->page ?? 1,
            'per_page' => $this->per_page ?? 15,
            'sort_order' => $this->sort_order ?? 'asc',
        ]);
    }
} 
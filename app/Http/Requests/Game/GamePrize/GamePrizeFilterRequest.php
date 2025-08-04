<?php

namespace App\Http\Requests\Game\GamePrize;

use Illuminate\Foundation\Http\FormRequest;

class GamePrizeFilterRequest extends FormRequest
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
            'sort_by' => 'nullable|string|in:game_instance_id,rank,reward,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
            'game_instance_id' => 'nullable|integer|exists:game_instances,id',
            'rank' => 'nullable|integer|min:1',
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
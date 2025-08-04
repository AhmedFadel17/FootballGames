<?php

namespace App\Http\Requests\GamesList\Bingo\BingoCondition;

use Illuminate\Foundation\Http\FormRequest;

class BingoConditionFilterRequest extends FormRequest
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
            'sort_by' => 'nullable|string|in:bingo_game_id,object_id,object_type,connection_type,bingo_match_id,is_marked,pos,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
            'bingo_game_id' => 'nullable|integer|exists:bingo_games,id',
            'object_id' => 'nullable|integer',
            'object_type' => 'nullable|string|max:255',
            'connection_type' => 'nullable|string|in:horizontal,vertical,diagonal',
            'bingo_match_id' => 'nullable|integer|exists:bingo_matches,id',
            'is_marked' => 'nullable|boolean',
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
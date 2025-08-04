<?php

namespace App\Http\Requests\Game\GameType;

use Illuminate\Foundation\Http\FormRequest;

class GameTypeFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            
        ];
    }

    
} 
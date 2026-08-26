<?php

namespace App\Http\Requests\GamesList\GridGame;

use Illuminate\Foundation\Http\FormRequest;

class SubmitGridGameAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'player_id' => 'required|exists:players,id',
            'row' => 'required|integer',
            'col' => 'required|integer',
        ];
    }
}

<?php

namespace App\Http\Requests\Core\Player;

use App\Enums\Core\PlayerPosition;
use App\Enums\Core\PlayerPreferredFoot;
use App\Enums\Core\PlayerSubPosition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePlayerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'fullname' => ['required', 'string', 'max:455'],
            'position' => ['required', Rule::enum(PlayerPosition::class)],
            'sub_position' => ['required', Rule::enum(PlayerSubPosition::class)],
            'date_of_birth' => ['required', 'date'],
            'country_id' => ['required', 'exists:countries,id'],
            'popularity' => ['required', 'integer', 'min:0', 'max:100'],
            'api_id' => ['nullable', 'integer'],
            'slug' => ['required', 'string', 'max:255'],
            'img_src' => ['required', 'string', 'max:500'],
            'height_cm' => ['required', 'integer', 'min:0', 'max:300'],
            'weight_kg' => ['required', 'integer', 'min:0', 'max:300'],
            'rating' => ['required', 'integer', 'min:0', 'max:100'],
            'market_value' => ['required', 'integer', 'min:0', 'max:1000000000'],
            'preferred_foot' => ['required', Rule::enum(PlayerPreferredFoot::class)],
            'is_retired' => ['required', 'boolean'],
            'current_team_id' => ['nullable', 'exists:teams,id'],
        ];
    }
}

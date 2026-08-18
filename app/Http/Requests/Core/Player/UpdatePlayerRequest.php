<?php

namespace App\Http\Requests\Core\Player;

use App\Enums\Core\PlayerPosition;
use App\Enums\Core\PlayerPreferredFoot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlayerRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'fullname' => ['sometimes', 'string', 'max:455'],
            'position' => ['sometimes', Rule::enum(PlayerPosition::class)],
            'date_of_birth' => ['sometimes', 'date'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'popularity' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'img_src' => ['sometimes', 'string', 'max:500'],
            'api_id' => ['sometimes', 'integer'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'height_cm' => ['sometimes', 'integer', 'min:0', 'max:300'],
            'weight_kg' => ['sometimes', 'integer', 'min:0', 'max:300'],
            'rating' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'market_value' => ['sometimes', 'integer', 'min:0', 'max:1000000000'],
            'preferred_foot' => ['sometimes', Rule::enum(PlayerPreferredFoot::class)],
        ];
    }
}

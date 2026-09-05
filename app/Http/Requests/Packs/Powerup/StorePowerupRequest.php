<?php
namespace App\Http\Requests\Packs\Powerup;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\PowerupType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePowerupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:50', 'unique:powerups,slug'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'img_src' => ['nullable', 'string', 'max:255'],
            'type' => ['required', Rule::enum(PowerupType::class)],
            'rarity' => ['required', Rule::in(CardRarity::class)],
            'duration' => ['required', 'integer', 'min:0'],
            'multiplier' => ['required', 'float', 'min:0.0'],
        ];
    }
}
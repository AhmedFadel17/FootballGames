<?php
namespace App\Http\Requests\Packs\Powerup;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\PowerupType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePowerupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $powerupId = $this->route('powerup')?->id ?? $this->route('powerup');

        return [
            'slug' => ['sometimes', 'string', 'max:50', Rule::unique('powerups', 'slug')->ignore($powerupId)],
            'name' => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string'],
            'img_src' => ['sometimes', 'nullable', 'string', 'max:255'],
            'type' => ['sometimes', Rule::enum(PowerupType::class)],
            'rarity' => ['sometimes', Rule::enum(CardRarity::class)],
            'duration' => ['sometimes', 'integer', 'min:0'],
            'multiplier' => ['sometimes', 'float', 'min:0.0'],
        ];
    }
}
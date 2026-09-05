<?php
namespace App\Http\Requests\Packs\Cosmetic;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\CosmeticType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCosmeticRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(CosmeticType::class)],
            'slug' => ['required', 'string', 'max:50', 'unique:cosmetics,slug'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:255'],
            'img_src' => ['required', 'string', 'max:255'],
            'rarity' => ['required', new Enum(CardRarity::class)],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
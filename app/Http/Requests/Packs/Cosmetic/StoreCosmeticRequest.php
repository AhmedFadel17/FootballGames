<?php
namespace App\Http\Requests\Packs\Cosmetic;

use App\Enums\Packs\CardRarity;
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
            'type' => ['required', 'string', 'max:30'],
            'slug' => ['required', 'string', 'max:50', 'unique:cosmetics,slug'],
            'name' => ['required', 'string', 'max:100'],
            'img_src' => ['required', 'string', 'max:255'],
            'rarity' => ['sometimes', new Enum(CardRarity::class)],
        ];
    }
}
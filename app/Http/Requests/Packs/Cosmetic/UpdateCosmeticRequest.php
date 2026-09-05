<?php
namespace App\Http\Requests\Packs\Cosmetic;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\CosmeticType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateCosmeticRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cosmeticId = $this->route('cosmetic')?->id ?? $this->route('cosmetic');

        return [
            'type' => ['sometimes', new Enum(CosmeticType::class)],
            'slug' => ['sometimes', 'string', 'max:50', Rule::unique('cosmetics', 'slug')->ignore($cosmeticId)],
            'name' => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'string', 'max:255'],
            'img_src' => ['sometimes', 'string', 'max:255'],
            'rarity' => ['sometimes', new Enum(CardRarity::class)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
<?php
namespace App\Http\Requests\Packs\Pack;

use App\Enums\Packs\PackLimitType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:50', 'unique:packs,slug'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'price_coins' => ['required', 'integer', 'min:0'],
            'cards_count' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'required_level' => ['sometimes', 'integer', 'min:1'],
            'user_limit' => ['nullable', 'integer', 'min:1'],
            'limit_type' => ['sometimes', Rule::enum(PackLimitType::class)],
            'img_src' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
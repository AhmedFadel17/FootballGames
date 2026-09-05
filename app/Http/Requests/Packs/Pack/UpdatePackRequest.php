<?php
namespace App\Http\Requests\Packs\Pack;

use App\Enums\Packs\PackLimitType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packId = $this->route('pack')?->id ?? $this->route('pack');

        return [
            'slug' => ['sometimes', 'string', 'max:50', Rule::unique('packs', 'slug')->ignore($packId)],
            'name' => ['sometimes', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'price_coins' => ['sometimes', 'integer', 'min:0'],
            'cards_count' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'required_level' => ['sometimes', 'integer', 'min:1'],
            'user_limit' => ['nullable', 'integer', 'min:1'],
            'limit_type' => ['sometimes', Rule::enum(PackLimitType::class)],
            'img_src' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
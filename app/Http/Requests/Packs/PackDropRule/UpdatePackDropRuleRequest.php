<?php
namespace App\Http\Requests\Packs\PackDropRule;

use App\Enums\Packs\CardRarity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdatePackDropRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pack_id' => ['sometimes', 'exists:packs,id'],
            'drop_type' => ['sometimes', Rule::in(['player_card', 'team', 'powerup', 'cosmetic', 'coins'])],
            'rarity' => ['nullable', new Enum(CardRarity::class)],
            'event_id' => ['nullable', 'exists:events,id'],
            'min_coins' => ['sometimes', 'integer', 'min:0'],
            'max_coins' => ['sometimes', 'integer', 'gte:min_coins'],
            'drop_percentage' => ['sometimes', 'numeric', 'min:0.01', 'max:100'],
        ];
    }
}
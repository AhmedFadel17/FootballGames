<?php
namespace App\Http\Requests\Packs\PlayerCard;

use App\Enums\Packs\CardRarity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdatePlayerCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'player_id' => ['sometimes', 'exists:players,id'],
            'event_id' => ['sometimes', 'exists:events,id'],
            'rarity' => ['sometimes', new Enum(CardRarity::class)],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:99'],
            'img_src' => ['nullable', 'string', 'max:255'],
            'is_packable' => ['sometimes', 'boolean'],
        ];
    }
}
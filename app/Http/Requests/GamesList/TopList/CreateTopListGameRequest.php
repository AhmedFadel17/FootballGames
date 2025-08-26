<?php

namespace App\Http\Requests\GamesList\TopList;

use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Shared\Enums\TopListItemstype;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTopListGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'game_id' => 'required|integer|exists:games,id',
            'title'   => 'required|string|min:1|max:255',
            'size'    => 'required|integer|min:5|max:20',
            'max_chances'    => 'required|integer|min:1|max:20',
            'type'    => [
                'required',
                'string',
                Rule::in(array_column(TopListItemstype::cases(), 'value')),
            ],
            'items'   => 'required|array|min:5|max:20',
            'items.*.id'  => 'required|integer|min:1',
            'items.*.pos' => 'required|integer|min:1',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $type = $this->input('type');
            $items = collect($this->input('items', []))->pluck('id')->toArray();

            if (empty($type) || empty($items)) {
                return;
            }

            switch ($type) {
                case TopListItemstype::PLAYER->value:
                    $exists = Player::whereIn('id', $items)->count();
                    if ($exists !== count($items)) {
                        $validator->errors()->add('items', 'Some players do not exist.');
                    }
                    break;

                case TopListItemstype::TEAM->value:
                    $exists = Team::whereIn('id', $items)->count();
                    if ($exists !== count($items)) {
                        $validator->errors()->add('items', 'Some teams do not exist.');
                    }
                    break;

                case TopListItemstype::COUNTRY->value:
                    $exists = Country::whereIn('id', $items)->count();
                    if ($exists !== count($items)) {
                        $validator->errors()->add('items', 'Some countries do not exist.');
                    }
                    break;
            }
        });
    }
}

<?php
namespace App\Http\Requests\Packs\Powerup;

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
            'description' => ['nullable', 'string'],
            'icon_src' => ['nullable', 'string', 'max:255'],
        ];
    }
}
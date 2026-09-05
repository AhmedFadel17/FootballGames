<?php
namespace App\Http\Requests\Packs\Powerup;

use Illuminate\Foundation\Http\FormRequest;

class StorePowerupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:50', 'unique:powerups,slug'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'icon_src' => ['nullable', 'string', 'max:255'],
        ];
    }
}
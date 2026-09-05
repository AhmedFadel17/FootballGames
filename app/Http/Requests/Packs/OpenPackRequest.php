<?php
namespace App\Http\Requests\Packs;

use Illuminate\Foundation\Http\FormRequest;

class OpenPackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'pack_id' => ['required', 'exists:packs,id'],
        ];
    }
}
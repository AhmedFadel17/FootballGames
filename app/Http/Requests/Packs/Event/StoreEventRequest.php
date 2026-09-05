<?php
namespace App\Http\Requests\Packs\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:50', 'unique:events,slug'],
            'name' => ['required', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'img_src' => ['nullable', 'string', 'max:255'],
            'theme_color' => ['sometimes', 'string', 'max:20'],
        ];
    }
}
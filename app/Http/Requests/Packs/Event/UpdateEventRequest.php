<?php
namespace App\Http\Requests\Packs\Event;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $eventId = $this->route('event')?->id ?? $this->route('event');

        return [
            'slug' => ['sometimes', 'string', 'max:50', Rule::unique('events', 'slug')->ignore($eventId)],
            'name' => ['sometimes', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'img_src' => ['nullable', 'string', 'max:255'],
            'theme_color' => ['sometimes', 'string', 'max:20'],
        ];
    }
}
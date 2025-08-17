<?php

namespace App\Http\Requests\Core\ManagerTeamPeriod;

use Illuminate\Foundation\Http\FormRequest;

class CreateManagerTeamPeriodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'manager_id' => ['required', 'exists:managers,id'],
            'team_id' => ['required', 'exists:teams,id'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
} 
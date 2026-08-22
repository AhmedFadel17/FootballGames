<?php

namespace App\Http\Requests\Core\CompetitionSeason;

use App\Http\Requests\Shared\BaseFilterRequest;

class CompetitionSeasonFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'competition_id', 'season_id', 'winner_team_id', 'season.start_year', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'season_id' => 'nullable|integer|exists:seasons,id',
            'competition_id' => 'nullable|integer|exists:competitions,id',
            'winner_team_id' => 'nullable|integer|exists:teams,id',
        ];
    }

}
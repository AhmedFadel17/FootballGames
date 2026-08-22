<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

readonly class CompetitionSeasonDTO
{
    public function __construct(
        public ?int $competitionId = null,
        public ?int $seasonId = null,
        public ?int $winnerTeamId = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            competitionId: isset($data['competition_id']) ? (int) $data['competition_id'] : null,
            seasonId: isset($data['season_id']) ? (int) $data['season_id'] : null,
            winnerTeamId: isset($data['winner_team_id']) ? (int) $data['winner_team_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'competition_id' => $this->competitionId,
            'season_id' => $this->seasonId,
            'winner_team_id' => $this->winnerTeamId,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}
<?php
namespace Database\Seeders;

use App\Enums\GamesList\TopListItemstype;
use App\Models\Core\Competition;
use App\Models\Core\Team;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use Illuminate\Database\Seeder;
use App\Services\GamesListServices\TopList\ITopListGameService;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use Illuminate\Support\Facades\DB;

class TopListGameSeeder extends Seeder
{
    public function __construct(
        protected ITopListGameService $topListGameService
    ) {
    }

    public function run(): void
    {
        $this->seedStandings();
    }

    private function seedStandings(): void
    {

        TopListGame::truncate();
        TopListItem::truncate();
        // Eager load seasons and their nested relations to optimize database calls
        $competitions = Competition::where("popularity", ">=", 50)
            ->with([
                'competitionSeasons' => function ($query) {
                    $query->latest()->take(3); // Pick the last 3 seasons per competition
                },
                'competitionSeasons.season',
                'competitionSeasons.standings.team'
            ])
            ->get();

        foreach ($competitions as $competition) {
            foreach ($competition->competitionSeasons as $compSeason) {

                $standings = $compSeason->standings
                    ->sortBy('position')
                    ->take(10);

                // Skip if the standing doesn't have a full top 10
                if ($standings->count() < 10) {
                    continue;
                }

                $items = [];
                foreach ($standings as $standing) {
                    if (!$standing->team) {
                        continue;
                    }

                    $items[] = [
                        'rank' => $standing->position,
                        'id' => $standing->team->id, // Morphable object_id
                        'display_value' => ($standing->points ?? 0) . ' Points', // Display points instead of team name!
                    ];
                }

                // Ensure we still have 10 valid teams after checks
                if (count($items) < 10) {
                    continue;
                }

                $seasonName = $compSeason->season->name ?? $compSeason->season_id;
                $diff = $competition->popularity >= 85 ? GameDifficulty::EASY : ($competition->popularity >= 70 ? GameDifficulty::NORMAL : GameDifficulty::HARD);
                $dto = new TopListGameDTO(
                    title: "Top 10: {$competition->name} ({$seasonName})",
                    description: "Can you name the top 10 teams in {$competition->name} for the {$seasonName} season?",
                    items_type: TopListItemstype::TEAM->value,
                    difficulty: $diff->value,
                    items: $items
                );

                $this->topListGameService->create($dto);
            }
        }
    }

}
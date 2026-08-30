<?php

namespace App\Services\GameEngine\ConditionPool;

use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GamesList\BingoConnectionType;
use App\Models\Core\Continent;
use App\Models\Core\Country;
use App\Models\Core\Manager;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Services\Core\Continents\IContinentService;
use App\Services\Core\Countries\ICountryService;
use App\Services\Core\Managers\IManagerService;
use App\Services\Core\Players\IPlayerService;
use App\Services\Core\Teams\ITeamService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class ConditionPoolService implements IConditionPoolService
{
    public function __construct(
        protected IPlayerService $playerService,
        protected ICountryService $countryService,
        protected ITeamService $teamService,
        protected IManagerService $managerService,
        protected IContinentService $continentService
    ) {
    }

    public function generatePool(GameDifficulty $difficulty, int $size): Collection
    {
        [$general, $origin] = $this->fetchCategorizedCandidates($difficulty, $size);
        return $general->merge($origin)->shuffle();
    }

    public function generateGridPools(GameDifficulty $difficulty, int $size): array
    {
        [$general, $origin] = $this->fetchCategorizedCandidates($difficulty, $size);

        $rowOriginCount = rand(0, 1);

        $rowItems = $origin->take($rowOriginCount)
            ->concat($general->splice(0, $size - $rowOriginCount))
            ->shuffle();

        $colItems = $general->splice(0, $size)->shuffle();

        return [$rowItems, $colItems];
    }

    protected function fetchCategorizedCandidates(GameDifficulty $difficulty, int $size): array
    {
        $minPlayersPop = $difficulty->minPopularity(Player::class);
        $minTeamsPop = $difficulty->minPopularity(Team::class);
        $minCountriesPop = $difficulty->minPopularity(Country::class);
        $minManagersPop = $difficulty->minPopularity(Manager::class);
        $minContinentsPop = $difficulty->minPopularity(Continent::class);

        $players = $this->playerService->getRandom($minPlayersPop, false, $size * 3);
        $teams = $this->teamService->getRandom($minTeamsPop, $size * 3);
        $countries = $this->countryService->getRandom($minCountriesPop, $size * 3);
        $managers = $this->managerService->getRandom($minManagersPop, false, $size * 3);
        $continents = $this->continentService->getRandom($minContinentsPop, $size);

        $generalItems = collect()
            ->merge($players->map(fn($p) => ['type' => Player::class, 'con' => BingoConnectionType::PLAYED_WITH, 'id' => $p->id]))
            ->merge($teams->map(fn($t) => ['type' => Team::class, 'con' => BingoConnectionType::PLAYED_FOR, 'id' => $t->id]))
            ->merge($managers->map(fn($m) => ['type' => Manager::class, 'con' => BingoConnectionType::COACHED_BY, 'id' => $m->id]))
            ->shuffle();

        $originItems = collect()
            ->merge($countries->map(fn($c) => ['type' => Country::class, 'con' => BingoConnectionType::FROM, 'id' => $c->id]))
            ->merge($continents->map(fn($c) => ['type' => Continent::class, 'con' => BingoConnectionType::FROM, 'id' => $c->id]))
            ->shuffle();

        return [$generalItems, $originItems];
    }

    public function validate(Player $player, Model $targetObject, string $objectType): bool
    {
        return match ($objectType) {
            Player::class => $this->playerService->playedTogether($player, $targetObject),
            Team::class => $this->playerService->playedForTeam($player, $targetObject),
            Manager::class => $this->playerService->playedUnderManager($player, $targetObject),
            Country::class => $player->country_id === $targetObject->id,
            Continent::class => $player->country?->continent_id === $targetObject->id,
            default => false,
        };
    }
}
<?php

namespace App\Services\Packs\PackDropRules;

use App\DTOs\Packs\PackDropRuleDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\PackDropRule;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PackDropRuleService implements IPackDropRuleService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(PackDropRule::query()->with('pack'), $dto)
            ->allowFilters(['id', 'pack_id', 'item_type', 'min_rating', 'drop_chance'])
            ->allowSorts(['id', 'drop_chance', 'min_rating', 'created_at'])
            ->paginate();
    }

    public function getById($id): PackDropRule
    {
        return PackDropRule::with('pack')->findOrFail($id);
    }

    public function create(PackDropRuleDTO $data): PackDropRule
    {
        $rule = PackDropRule::create($data->toArray());
        $rule->load('pack');
        return $rule;
    }

    public function update($id, PackDropRuleDTO $data): PackDropRule
    {
        $rule = PackDropRule::findOrFail($id);
        $rule->update($data->toUpdateArray());
        $rule->load('pack');
        return $rule;
    }

    public function delete($id): bool
    {
        $rule = PackDropRule::findOrFail($id);
        $rule->delete();
        return true;
    }
}
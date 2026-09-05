<?php

namespace App\Services\Packs\PackDropRules;

use App\DTOs\Packs\PackDropRuleDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\PackDropRule;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IPackDropRuleService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getById($id): PackDropRule;

    public function create(PackDropRuleDTO $data): PackDropRule;

    public function update($id, PackDropRuleDTO $data): PackDropRule;

    public function delete($id): bool;
}
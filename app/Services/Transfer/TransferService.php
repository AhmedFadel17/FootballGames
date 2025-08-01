<?php

namespace App\Services\Transfer;

use App\DTOs\Core\Transfer\TransferDTO;
use App\DTOs\Core\Transfer\TransferResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Transfer;
use App\Services\Pagination\IPaginationService;

class TransferService implements ITransferService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['player_id', 'from_team_id', 'to_team_id', 'transfer_date'];
        $searchableFields = [];

        return $this->_paginationService
            ->paginate(Transfer::query(), $dto, TransferResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): TransferResponseDTO
    {
        $transfer = Transfer::findOrFail($id);
        return new TransferResponseDTO($transfer);
    }

    public function create(TransferDTO $data): TransferResponseDTO
    {
        $transfer = Transfer::create($data->toArray());
        return new TransferResponseDTO($transfer);
    }

    public function update($id, TransferDTO $data): TransferResponseDTO
    {
        $transfer = Transfer::findOrFail($id);
        $transfer->update($data->toArray());
        return new TransferResponseDTO($transfer);
    }

    public function delete($id): bool
    {
        $transfer = Transfer::findOrFail($id);
        $transfer->delete();
        return true;
    }
} 
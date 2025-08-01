<?php

namespace App\Services\Transfer;

use App\DTOs\Core\Transfer\TransferDTO;
use App\DTOs\Core\Transfer\TransferResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ITransferService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :TransferResponseDTO;
    public function create(TransferDTO $data) : TransferResponseDTO;
    public function update(int $id, TransferDTO $data) :TransferResponseDTO;
    public function delete(int $id):bool;
} 
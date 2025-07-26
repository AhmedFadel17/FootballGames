<?php

namespace App\Services\Players;

use App\Models\User;
use App\Repositories\Players\IPlayersRepository;

class PlayerService implements IPlayerService
{
    private readonly IPlayersRepository $_repo;
    public function __construct(IPlayersRepository $repo) {
        $this->_repo = $repo;
    }
    public function getAll()
    {
        return $this->_repo->all();
    }

    public function getById(int $id)
    {
        return User::findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function delete(int $id)
    {
        return User::destroy($id);
    }
}

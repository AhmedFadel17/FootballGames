<?php

namespace App\Services\Users;

use App\Models\User;
use App\Repositories\Users\IUsersRepository;

class UserService implements IUserService
{
    private readonly IUsersRepository $_repo;
    public function __construct(IUsersRepository $repo) {
        $this->_repo = $repo;
    }
    public function getAllUsers()
    {
        return $this->_repo->all();
    }

    public function getUserById(int $id)
    {
        return User::findOrFail($id);
    }

    public function createUser(array $data)
    {
        return User::create($data);
    }

    public function updateUser(int $id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function deleteUser(int $id)
    {
        return User::destroy($id);
    }
}

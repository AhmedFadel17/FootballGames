<?php

namespace App\Repositories\Users;

use App\Models\User;
use App\Repositories\BaseRepository;

class PlayerRepository extends BaseRepository implements IUsersRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

}
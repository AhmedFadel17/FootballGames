<?php

namespace App\Repositories\Players;

use App\Models\Player;
use App\Repositories\BaseRepository;

class PlayerRepository extends BaseRepository implements IPlayersRepository
{
    public function __construct(Player $model)
    {
        parent::__construct($model);
    }

}
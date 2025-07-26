<?php

namespace App\Http\Controllers;

use App\Services\Players\IPlayerService;

class PlayersController extends Controller
{
    private readonly IPlayerService $_service;
    public function __construct(IPlayerService $service)
    {
        $this->_service = $service;
    }

    public function GetAll()
    {
        $players = $this->_service->getAll();
        return response($players);
    }
}

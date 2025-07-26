<?php

namespace App\Http\Controllers;

use App\Services\Users\IUserService;

class UsersController extends Controller
{
    private readonly IUserService $_service;
    public function __construct(IUserService $service) {
        $this->_service = $service;
    }
}

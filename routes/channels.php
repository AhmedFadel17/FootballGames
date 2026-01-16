<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('room.{id}', function ($user, $id) {
    Log::info("User {$user->id} is attempting to join room {$id}");
    return [
        'id' => $user->id,
        'username' => $user->username,
        'avatar' => $user->avatar, 
    ];
});
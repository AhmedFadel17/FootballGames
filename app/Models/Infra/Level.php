<?php

namespace App\Models\Infra;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = [
        'level',
        'required_xp',
        'coin_reward',
    ];
}
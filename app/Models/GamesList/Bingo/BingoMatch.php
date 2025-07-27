<?php

namespace App\Models\GamesList\Bingo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoMatch extends Model
{
    protected $fillable = ['player_id', 'matched_condition_id', 'game_instance_id'];
}
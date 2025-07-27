<?php

namespace App\Models\GamesList\Bingo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoCard extends Model
{
    protected $fillable = ['user_id', 'game_instance_id', 'condition_ids'];
}

<?php

namespace App\Models\GamesList\Top10;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Top10Entry extends Model
{
    protected $fillable = ['game_entry_id', 'ordered_player_ids'];
}
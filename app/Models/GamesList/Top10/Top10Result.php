<?php

namespace App\Models\GamesList\Top10;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Top10Result extends Model
{
    protected $fillable = ['game_instance_id', 'correct_ordered_ids'];
}
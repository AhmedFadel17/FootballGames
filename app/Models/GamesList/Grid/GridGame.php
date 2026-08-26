<?php

namespace App\Models\GamesList\Grid;

use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GridGame extends Model
{
    protected $fillable = [
        'game_instance_id',
        'size',
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }
    public function conditions(): HasMany
    {
        return $this->hasMany(GridCondition::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(GridAnswer::class);
    }
}

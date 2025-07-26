<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    protected $fillable = ['name', 'game_type_id'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(GameType::class, 'game_type_id');
    }

    public function instances(): HasMany
    {
        return $this->hasMany(GameInstance::class);
    }
}
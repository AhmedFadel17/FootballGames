<?php

namespace App\Models\GamesList\Career;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CareerGame extends Model
{
    protected $fillable = [
        'player_id',
        'total_steps',
        'difficulty',
    ];

    protected $casts = [
        'total_steps' => 'integer',
        'difficulty' => GameDifficulty::class,
    ];

    public function careerInstances(): HasMany
    {
        return $this->hasMany(CareerGameInstance::class, 'career_game_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_id');
    }

}

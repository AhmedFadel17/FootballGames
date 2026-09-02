<?php

namespace App\Models\GamesList\Career;

use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerGameInstance extends Model
{
    protected $fillable = [
        'game_instance_id',
        'career_game_id',
        'revealed_steps',
        'attempts_left',
    ];

    protected $casts = [
        'revealed_steps' => 'integer',
        'attempts_left' => 'integer',
    ];

    public function careerGame(): BelongsTo
    {
        return $this->belongsTo(CareerGame::class, 'career_game_id');
    }

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }

}

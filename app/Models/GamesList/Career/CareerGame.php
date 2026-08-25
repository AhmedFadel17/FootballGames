<?php

namespace App\Models\GamesList\Career;

use App\Models\Core\Player;
use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerGame extends Model
{
    protected $fillable = [
        'game_instance_id',
        'player_id',
        'total_steps',
        'revealed_steps',
        'attempts_left',
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_id');
    }

}

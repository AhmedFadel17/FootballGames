<?php

namespace App\Models\GamesList\GuessThePlayer;

use App\Models\Game\GameInstance;
use Illuminate\Database\Eloquent\Model;

class GuessThePlayerGame extends Model
{
    protected $fillable = [
        'game_instance_id',
        'players_count',
    ];

    public function instance()
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }
    public function assignments()
    {
        return $this->hasMany(GuessThePlayerGameAssignment::class);
    }
}

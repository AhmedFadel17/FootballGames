<?php

namespace App\Models\GamesList\Bingo;

use App\Models\Core\Player;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoMatch extends Model
{
    protected $fillable = [
        'bingo_game_id',
        'player_id',
        'pos',
    ];

    public function game()
    {
        return $this->belongsTo(BingoGame::class, 'bingo_game_id');
    }

    public function player()
    {
        return $this->belongsTo(Player::class, 'player_id');
    }
}
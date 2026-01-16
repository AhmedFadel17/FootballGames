<?php

namespace App\Models\GamesList\GuessThePlayer;

use App\Models\Core\Player;
use App\Models\Game\GameEntry;
use Illuminate\Database\Eloquent\Model;

class GuessThePlayerGameAssignment extends Model
{
    protected $fillable = [
        'guess_the_player_game_id',
        'game_entry_id',
        'target_player_id',
        'is_solved',
        'solved_at'
    ];

    public function game()
    {
        return $this->belongsTo(GuessThePlayerGame::class, 'guess_the_player_game_id');
    }

    public function player()
    {
        return $this->belongsTo(Player::class, 'target_player_id');

    }
    public function entry()
    {
        return $this->belongsTo(GameEntry::class, 'game_entry_id');
    }
}

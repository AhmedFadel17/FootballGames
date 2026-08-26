<?php

namespace App\Models\GamesList\Grid;

use App\Models\Core\Player;
use Illuminate\Database\Eloquent\Model;

class GridAnswer extends Model
{
    protected $fillable = [
        'grid_game_id',
        'game_entry_id',
        'player_id',
        'row_index',
        'column_index',
        'is_correct',
        'rarity_score',
    ];

    public function game()
    {
        return $this->belongsTo(GridGame::class, 'grid_game_id');
    }

    public function player()
    {
        return $this->belongsTo(Player::class, 'player_id');
    }
}
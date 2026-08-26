<?php

namespace App\Models\GamesList\Grid;


use App\Enums\GamesList\BingoConnectionType;
use App\Enums\GamesList\GridCellType;
use Illuminate\Database\Eloquent\Model;

class GridCondition extends Model
{
    protected $fillable = [
        'grid_game_id',
        'object_id',
        'object_type',
        'connection_type',
        'type',
        'pos',
    ];

    protected $casts = [
        'connection_type' => BingoConnectionType::class,
        'type' => GridCellType::class,
    ];

    public function game()
    {
        return $this->belongsTo(GridGame::class, 'grid_game_id');
    }

    public function objectable()
    {
        return $this->morphTo(__FUNCTION__, 'object_type', 'object_id');
    }
}
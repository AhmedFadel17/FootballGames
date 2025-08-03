<?php

namespace App\Models\GamesList\Bingo;

use App\Shared\Enums\BingoConnectionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoCondition extends Model
{
    protected $fillable = [
        'bingo_game_id',
        'object_id',
        'object_type',
        'connection_type',
        'bingo_match_id',
        'is_marked',
        'pos',
    ];

    protected $casts = [
        'connection_type' => BingoConnectionType::class,
        'is_marked' => 'boolean',
    ];

    public function game()
    {
        return $this->belongsTo(BingoGame::class, 'bingo_game_id');
    }

    public function objectable()
    {
        return $this->morphTo(__FUNCTION__, 'object_type', 'object_id');
    }

    public function match()
    {
        return $this->belongsTo(BingoMatch::class, 'bingo_match_id');
    }
}

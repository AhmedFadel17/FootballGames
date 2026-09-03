<?php

namespace App\Models\GamesList\Bingo;

use App\Enums\GamesList\BingoConnectionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class BingoCondition extends Model
{
    protected $fillable = [
        'bingo_game_id',
        'object_id',
        'object_type',
        'connection_type',
        'pos',
    ];

    protected $casts = [
        'connection_type' => BingoConnectionType::class,
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(BingoGame::class, 'bingo_game_id');
    }

    public function objectable(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'object_type', 'object_id');
    }

}

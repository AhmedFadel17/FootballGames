<?php

namespace App\Models\GamesList\Bingo;

use App\Models\Game\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoGame extends Model
{
    protected $fillable = [
        'game_instance_id',
        'size',
        'remaining_answers'
    ];

    public function instance()
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }
    public function conditions()
    {
        return $this->hasMany(BingoCondition::class);
    }

    public function matches()
    {
        return $this->hasMany(BingoMatch::class);
    }
}

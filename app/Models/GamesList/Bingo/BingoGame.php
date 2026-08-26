<?php

namespace App\Models\GamesList\Bingo;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoGame extends Model
{
    protected $fillable = [
        'game_instance_id',
        'size',
        'remaining_answers',
        'difficulty',
    ];

    protected $casts = [
        'size' => 'integer',
        'remaining_answers' => 'integer',
        'difficulty' => GameDifficulty::class,
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }
    public function conditions(): HasMany
    {
        return $this->hasMany(BingoCondition::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(BingoMatch::class);
    }
}

<?php

namespace App\Models\GamesList\Bingo;

use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BingoGame extends Model
{
    protected $fillable = [
        'size',
        'total_answers',
        'difficulty',
    ];

    protected $casts = [
        'size' => 'integer',
        'total_answers' => 'integer',
        'difficulty' => GameDifficulty::class,
    ];


    public function bingoInstances(): HasMany
    {
        return $this->hasMany(BingoGameInstance::class);
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

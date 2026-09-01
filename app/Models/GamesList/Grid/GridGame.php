<?php

namespace App\Models\GamesList\Grid;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GridGame extends Model
{
    protected $fillable = [
        'size',
        'difficulty',
    ];

    protected $casts = [
        'size' => 'integer',
        'difficulty' => GameDifficulty::class,
    ];

    public function gridGameInstances(): HasMany
    {
        return $this->hasMany(GridGameInstance::class);
    }
    public function conditions(): HasMany
    {
        return $this->hasMany(GridCondition::class);
    }

}

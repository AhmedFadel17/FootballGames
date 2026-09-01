<?php
namespace App\Models\GamesList\Grid;

use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class GridGameInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_instance_id',
        'grid_game_id',
        'max_attempts',
    ];

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class);
    }

    public function gridGame(): BelongsTo
    {
        return $this->belongsTo(GridGame::class, 'grid_game_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(GridAnswer::class, 'grid_game_instance_id');
    }
}
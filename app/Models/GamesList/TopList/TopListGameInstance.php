<?php
namespace App\Models\GamesList\TopList;

use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class TopListGameInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_instance_id',
        'top_list_game_id',
        'max_attempts',
    ];

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class);
    }

    public function masterQuestion(): BelongsTo
    {
        return $this->belongsTo(TopListGame::class, 'top_list_game_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TopListItem::class, 'top_list_game_id', 'top_list_game_id');
    }

    public function guesses(): HasMany
    {
        return $this->hasMany(TopListGuess::class, 'top_list_game_instance_id');
    }
}
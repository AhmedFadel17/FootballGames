<?php

namespace App\Models\GamesList\TopList;


use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GamesList\TopListItemstype;
use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TopListGame extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'items_type',
        'total_items',
        'difficulty',
    ];

    protected $casts = [
        'items_type' => TopListItemstype::class,
        'total_items' => 'integer',
        'max_attempts' => 'integer',
        'difficulty' => GameDifficulty::class,
    ];


    public function items(): HasMany
    {
        return $this->hasMany(TopListItem::class)->orderBy('rank', 'asc');
    }

    public function guesses(): HasMany
    {
        return $this->hasMany(TopListGuess::class);
    }

}

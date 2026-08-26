<?php

namespace App\Models\GamesList\TopList;

use App\Enums\GamesList\TopListItemstype;
use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\Team;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Relation;

class TopListItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'top_list_game_id',
        'object_id',
        'rank',
        'display_value',
    ];

    protected $casts = [
        'rank' => 'integer',
    ];

    public static function boot(): void
    {
        parent::boot();

        Relation::enforceMorphMap([
            TopListItemstype::PLAYER->value => Player::class,
            TopListItemstype::TEAM->value => Team::class,
            TopListItemstype::COUNTRY->value => Country::class,
        ]);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(TopListGame::class, 'top_list_game_id');
    }
    public function object(): MorphTo
    {
        return $this->morphTo(
            name: 'object',
            type: 'game.items_type',
            id: 'object_id'
        );
    }
}

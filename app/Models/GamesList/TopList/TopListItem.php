<?php

namespace App\Models\GamesList\TopList;

use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Shared\Enums\TopListItemstype;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class TopListItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'top_list_game_id',
        'pos',
        'object_id',
    ];

    public function game()
    {
        return $this->belongsTo(TopListGame::class,'top_list_game_id');
    }

    public function object()
    {
        $type = $this->game->items_type;

        switch ($type) {
            case TopListItemstype::PLAYER->value:
                return $this->belongsTo(Player::class, 'object_id');
            case TopListItemstype::TEAM->value:
                return $this->belongsTo(Team::class, 'object_id');
            case TopListItemstype::COUNTRY->value:
                return $this->belongsTo(Country::class, 'object_id');
            default:
                return null;
        }
    }

    public function answers()
    {
        return $this->hasMany(TopListAnswer::class);
    }
}

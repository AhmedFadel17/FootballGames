<?php

namespace App\Models\GamesList\TopList;

use App\Models\Game\Game;
use App\Models\Game\GameInstance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopListGame extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'items_type',
        'title',
        'size',
        'max_chances',
    ];
    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id');
    }
    public function items()
    {
        return $this->hasMany(TopListItem::class);
    }
}

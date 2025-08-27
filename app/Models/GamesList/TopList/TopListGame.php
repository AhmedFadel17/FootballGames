<?php

namespace App\Models\GamesList\TopList;

use App\Models\Game\GameInstance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopListGame extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_instance_id',
        'items_type',
        'title',
        'size',
        'max_chances',
    ];
    public function instance()
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }
    public function items()
    {
        return $this->hasMany(TopListItem::class);
    }
}

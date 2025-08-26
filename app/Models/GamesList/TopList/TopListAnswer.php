<?php

namespace App\Models\GamesList\TopList;

use App\Models\Game\GameEntry;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopListAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'top_list_item_id',
        'game_entry_id',
    ];

    public function item()
    {
        return $this->belongsTo(TopListItem::class, 'top_list_item_id');
    }

    public function entry()
    {
        return $this->belongsTo(GameEntry::class, 'game_entry_id');
    }
}

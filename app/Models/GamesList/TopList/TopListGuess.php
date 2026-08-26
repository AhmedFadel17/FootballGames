<?php

namespace App\Models\GamesList\TopList;

use App\Enums\GamesList\TopListItemstype;
use App\Models\GameEngine\GameEntry;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TopListGuess extends Model
{
    use HasFactory;

    protected $fillable = [
        'top_list_game_instance_id',
        'game_entry_id',
        'object_id',
        'object_type',
        'is_correct',
        'matched_rank',
    ];

    protected $casts = [
        'object_type' => TopListItemstype::class,
        'is_correct' => 'boolean',
        'matched_rank' => 'integer',
    ];

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(TopListGameInstance::class, 'top_list_game_instance_id');
    }

    public function entry(): BelongsTo
    {
        return $this->belongsTo(GameEntry::class, 'game_entry_id');
    }

    public function object(): MorphTo
    {
        return $this->morphTo();
    }
}

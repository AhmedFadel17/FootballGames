<?php

namespace App\Models\Game;

use App\Models\User;
use App\Shared\Enums\GameEntryStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameEntry extends Model
{
    protected $fillable = ['user_id', 'game_instance_id'];
    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class,'game_instance_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }
}

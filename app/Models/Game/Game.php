<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    protected $fillable = ['name','min_players','max_players','slug','description','is_active'];

    public function instances(): HasMany
    {
        return $this->hasMany(GameInstance::class);
    }
}
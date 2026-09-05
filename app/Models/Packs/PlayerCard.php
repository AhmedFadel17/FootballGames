<?php

namespace App\Models\Packs;

use App\Enums\CardRarity;
use App\Models\Core\Player;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PlayerCard extends Model
{
    protected $fillable = [
        'player_id',
        'event_id',
        'rarity',
        'rating',
        'img_src',
        'is_packable',
    ];

    protected $casts = [
        'rarity' => CardRarity::class,
        'rating' => 'integer',
        'is_packable' => 'boolean',
    ];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    // Polymorphic link to user inventory
    public function userCards(): MorphMany
    {
        return $this->morphMany(UserCard::class, 'cardable');
    }
}
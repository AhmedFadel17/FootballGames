<?php

namespace App\Models\Packs;

use App\Enums\Packs\CardRarity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackDropRule extends Model
{
    protected $fillable = [
        'pack_id',
        'drop_type',
        'rarity',
        'event_id',
        'min_coins',
        'max_coins',
        'drop_percentage',
    ];

    protected $casts = [
        'rarity' => CardRarity::class,
        'min_coins' => 'integer',
        'max_coins' => 'integer',
        'drop_percentage' => 'float',
    ];

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
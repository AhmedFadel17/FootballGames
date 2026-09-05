<?php

namespace App\Models\Packs;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\CosmeticType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Cosmetic extends Model
{
    protected $fillable = [
        'type',
        'slug',
        'name',
        'description',
        'img_src',
        'rarity',
        'is_active',
    ];

    protected $casts = [
        'type' => CosmeticType::class,
        'rarity' => CardRarity::class,
        'is_active' => 'boolean',
    ];

    public function userCards(): MorphMany
    {
        return $this->morphMany(UserCard::class, 'cardable');
    }
}
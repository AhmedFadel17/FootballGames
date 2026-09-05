<?php

namespace App\Models\Packs;

use App\Enums\CardRarity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Cosmetic extends Model
{
    protected $fillable = [
        'type',
        'slug',
        'name',
        'img_src',
        'rarity',
    ];

    protected $casts = [
        'rarity' => CardRarity::class,
    ];

    public function userCards(): MorphMany
    {
        return $this->morphMany(UserCard::class, 'cardable');
    }
}
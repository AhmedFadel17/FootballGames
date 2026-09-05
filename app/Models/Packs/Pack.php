<?php

namespace App\Models\Packs;

use App\Enums\Packs\PackLimitType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pack extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_coins',
        'cards_count',
        'required_level',
        'user_limit',
        'limit_type',
        'img_src',
        'is_active',
    ];

    protected $casts = [
        'price_coins' => 'integer',
        'cards_count' => 'integer',
        'required_level' => 'integer',
        'user_limit' => 'integer',
        'limit_type' => PackLimitType::class,
        'is_active' => 'boolean',
    ];

    public function dropRules(): HasMany
    {
        return $this->hasMany(PackDropRule::class);
    }

    public function openings(): HasMany
    {
        return $this->hasMany(UserPackOpening::class);
    }
}
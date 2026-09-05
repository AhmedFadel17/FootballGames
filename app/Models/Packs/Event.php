<?php

namespace App\Models\Packs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'is_active',
        'start_date',
        'end_date',
        'img_src',
        'theme_color',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function playerCards(): HasMany
    {
        return $this->hasMany(PlayerCard::class);
    }

    public function dropRules(): HasMany
    {
        return $this->hasMany(PackDropRule::class);
    }

    // Scope for active events within their operational time window
    public function scopeActiveWindow($query)
    {
        return $query->where('is_active', true)
            ->where(fn($q) => $q->whereNull('start_date')->orWhere('start_date', '<=', now()))
            ->where(fn($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', now()));
    }
}
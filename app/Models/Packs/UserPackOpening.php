<?php

namespace App\Models\Packs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use User;

class UserPackOpening extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'pack_id',
        'coins_spent',
        'dropped_items',
        'created_at',
    ];

    protected $casts = [
        'coins_spent' => 'integer',
        'dropped_items' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class);
    }
}
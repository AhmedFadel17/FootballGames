<?php

namespace App\Models\Packs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\User;

class UserCard extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'cardable_type',
        'cardable_id',
        'quantity',
        'obtained_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'obtained_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cardable(): MorphTo
    {
        return $this->morphTo();
    }
}
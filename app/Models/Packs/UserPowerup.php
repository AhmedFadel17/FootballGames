<?php

namespace App\Models\Packs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class UserPowerup extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'powerup_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function powerup(): BelongsTo
    {
        return $this->belongsTo(Powerup::class);
    }
}
<?php

namespace App\Models\GamesList\Bingo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoCondition extends Model
{
    protected $fillable = ['title', 'rule_json'];
}

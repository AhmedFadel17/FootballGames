<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Manager extends Model
{
    protected $fillable = ['name', 'nationality'];

    public function teamPeriods(): HasMany
    {
        return $this->hasMany(ManagerTeamPeriod::class);
    }
}
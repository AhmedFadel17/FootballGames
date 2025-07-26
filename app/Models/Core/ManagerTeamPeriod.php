<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManagerTeamPeriod extends Model
{
    protected $fillable = ['manager_id', 'team_id', 'start_date', 'end_date'];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Manager::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
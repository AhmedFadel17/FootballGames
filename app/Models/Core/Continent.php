<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Continent extends Model
{
    protected $fillable = ['name','code'];

    public function countries(): HasMany
    {
        return $this->hasMany(Country::class);
    }
}
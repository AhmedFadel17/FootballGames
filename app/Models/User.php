<?php

namespace App\Models;

use App\Models\Packs\UserCard;
use App\Models\Packs\UserPackOpening;
use App\Models\Packs\UserPowerup;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements OAuthenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'avatar',
        'games_played',
        'games_won',
        'games_lost',
        'favorite_team',
        'role',
        'refresh_token',
        'refresh_token_expires_at',

        'points',
        'coins',
        'xp',
        'level',
        'stamina',
        'max_stamina',
        'last_stamina_update',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'coins' => 'integer',
            'games_played' => 'integer',
            'games_won' => 'integer',
            'games_lost' => 'integer',
            'last_stamina_update' => 'datetime',
        ];
    }

    public function findForPassport(string $username): ?self
    {
        return $this->where('email', $username)
            ->orWhere('username', $username)
            ->first();
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function userSettings()
    {
        return $this->hasMany(UserSetting::class);
    }

    public function cards(): HasMany
    {
        return $this->hasMany(UserCard::class);
    }

    public function powerups(): HasMany
    {
        return $this->hasMany(UserPowerup::class);
    }

    public function packOpenings(): HasMany
    {
        return $this->hasMany(UserPackOpening::class);
    }
}

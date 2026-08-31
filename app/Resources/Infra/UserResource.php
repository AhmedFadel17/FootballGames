<?php
namespace App\Resources\Infra;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'favorite_team' => $this->favorite_team,
            'role' => $this->role,
        ];
    }
}
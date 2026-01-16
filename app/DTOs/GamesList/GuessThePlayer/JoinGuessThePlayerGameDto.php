<?php
namespace App\DTOs\GamesList\GuessThePlayer;

use Illuminate\Http\Request;

readonly class JoinGuessThePlayerGameDto
{

    public function __construct(
        public string $code,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            code: $data['code'],
        );
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code,
        ];
    }
}

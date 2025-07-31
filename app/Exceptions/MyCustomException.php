<?php

namespace App\Exceptions;

use Exception;

class MyCustomException extends Exception
{
    protected $message;
    protected $statusCode;

    public function __construct(string $message = "Something went wrong", int $statusCode = 400)
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
    }

    public function render($request)
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage()
        ], $this->statusCode);
    }
}

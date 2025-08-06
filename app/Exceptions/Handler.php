<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        // ✅ Handle Validation Errors
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $exception->errors()
            ], 422);
        }

        // ✅ Handle Model Not Found
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        // ✅ Handle Authentication Errors
        if ($exception instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 401);
        }


        // ✅ Handle Authorization Errors (Forbidden)
        if ($exception instanceof AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => 'This action is not authorized',
                'details' => [
                    'exception'   => class_basename($exception), // e.g., "AuthorizationException"
                    'user'        => auth()->check() ? [
                        'id'    => auth()->id(),
                        'email' => auth()->user()->email,
                        'role'  => auth()->user()->role,
                        'abilities' => auth()->user()->currentAccessToken()
                            ? auth()->user()->currentAccessToken()->abilities
                            : [],
                    ] : null,
                    'route'       => $request->path(),       // Endpoint user attempted to access
                    'method'      => $request->method(),     // HTTP verb (GET, POST, etc.)
                    'timestamp'   => now()->toDateTimeString(),
                ],
            ], 403);
        }


        // ✅ Handle Generic HTTP Exceptions
        if ($exception instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage() ?: 'HTTP Error'
            ], $exception->getStatusCode());
        }

        // ✅ Handle All Other Exceptions (Internal Server Error)
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong on the server',
            'error'   => config('app.debug') ? $exception->getMessage() : 'Server Error'
        ], 500);
    }
}

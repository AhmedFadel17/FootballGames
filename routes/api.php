<?php

use App\Http\Controllers\Core\PlayerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::apiResource('players', PlayerController::class);
    });
});

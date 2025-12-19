<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AsteroidController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;

// Public asteroid endpoints
Route::get('/asteroids', [AsteroidController::class, 'index']);
Route::get('/asteroids/{target}', [AsteroidController::class, 'index']);

// Public auth endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// PROTECTED routes – require Sanctum token
Route::middleware('auth:sanctum')->group(function () {

    // Current logged in user
    Route::get('/user', [AuthController::class, 'getUser']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Favorites CRUD
    Route::get('/favorites', [FavoriteController::class, 'index']);           // READ
    Route::post('/favorites', [FavoriteController::class, 'store']);          // CREATE
    Route::put('/favorites/{id}', [FavoriteController::class, 'update']);     // UPDATE
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']); // DELETE

    // Toggle / check helpers
    Route::post('/favorites/{asteroid_id}/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites/{asteroid_id}/check', [FavoriteController::class, 'check']);
});

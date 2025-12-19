<?php

use App\Http\Controllers\MusicFileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::get('/music', function () {
        return Inertia::render('music'); // Render the music
    })->name('music');

    Route::post('/api/musics', [MusicFileController::class, 'store'])->name('musics.store');
    Route::get('/api/musics', [MusicFileController::class, 'index'])->name('musics.index');
    Route::delete('/api/musics/{id}', [MusicFileController::class, 'destroy']);
    Route::post('/api/musics/{id}', [MusicFileController::class, 'update']);

require __DIR__.'/settings.php';


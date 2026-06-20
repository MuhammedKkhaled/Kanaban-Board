<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('boards.index')
        : Inertia::render('Landing');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Boards
    Route::resource('boards', BoardController::class)->except(['create', 'edit']);

    // Columns (nested under a board for create/reorder)
    Route::post('boards/{board}/columns', [ColumnController::class, 'store'])->name('columns.store');
    Route::patch('boards/{board}/columns/reorder', [ColumnController::class, 'reorder'])->name('columns.reorder');
    Route::patch('columns/{column}', [ColumnController::class, 'update'])->name('columns.update');
    Route::delete('columns/{column}', [ColumnController::class, 'destroy'])->name('columns.destroy');

    // Cards
    Route::post('columns/{column}/cards', [CardController::class, 'store'])->name('cards.store');
    Route::post('cards/{card}/move', [CardController::class, 'move'])->name('cards.move');
    Route::patch('cards/{card}', [CardController::class, 'update'])->name('cards.update');
    Route::delete('cards/{card}', [CardController::class, 'destroy'])->name('cards.destroy');

    // Labels (nested under a board for create)
    Route::post('boards/{board}/labels', [LabelController::class, 'store'])->name('labels.store');
    Route::patch('labels/{label}', [LabelController::class, 'update'])->name('labels.update');
    Route::delete('labels/{label}', [LabelController::class, 'destroy'])->name('labels.destroy');
});

require __DIR__.'/auth.php';

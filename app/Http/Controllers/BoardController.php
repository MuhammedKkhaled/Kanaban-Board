<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoardRequest;
use App\Models\Board;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function index(Request $request): Response
    {
        $boards = $request->user()->boards()
            ->withCount('columns')
            ->latest()
            ->get();

        return Inertia::render('Boards/Index', [
            'boards' => $boards,
        ]);
    }

    public function store(StoreBoardRequest $request): RedirectResponse
    {
        $board = $request->user()->boards()->create($request->validated());

        // Seed default columns for a new board.
        foreach (['To Do', 'In Progress', 'Done'] as $index => $name) {
            $board->columns()->create(['name' => $name, 'position' => $index]);
        }

        return redirect()->route('boards.show', $board);
    }

    public function show(Request $request, Board $board): Response
    {
        $this->authorize('view', $board);

        $board->load([
            'columns.cards.labels',
            'labels',
        ]);

        return Inertia::render('Boards/Show', [
            'board' => $board,
        ]);
    }

    public function update(StoreBoardRequest $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $board->update($request->validated());

        return back();
    }

    public function destroy(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('delete', $board);

        $board->delete();

        return redirect()->route('boards.index');
    }
}

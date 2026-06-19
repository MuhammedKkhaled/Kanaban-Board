<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColumnRequest;
use App\Models\Board;
use App\Models\Column;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ColumnController extends Controller
{
    public function store(StoreColumnRequest $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $board->columns()->create([
            'name' => $request->validated('name'),
            'position' => (int) $board->columns()->max('position') + 1,
        ]);

        return back();
    }

    public function update(StoreColumnRequest $request, Column $column): RedirectResponse
    {
        $this->authorize('update', $column->board);

        $column->update($request->validated());

        return back();
    }

    public function destroy(Request $request, Column $column): RedirectResponse
    {
        $this->authorize('update', $column->board);

        $column->delete();

        return back();
    }

    public function reorder(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'columns' => ['required', 'array'],
            'columns.*' => ['integer'],
        ]);

        DB::transaction(function () use ($board, $validated) {
            foreach ($validated['columns'] as $position => $columnId) {
                $board->columns()->whereKey($columnId)->update(['position' => $position]);
            }
        });

        return back();
    }
}

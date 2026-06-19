<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLabelRequest;
use App\Models\Board;
use App\Models\Label;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function store(StoreLabelRequest $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $board->labels()->create($request->validated());

        return back();
    }

    public function update(StoreLabelRequest $request, Label $label): RedirectResponse
    {
        $this->authorize('update', $label->board);

        $label->update($request->validated());

        return back();
    }

    public function destroy(Request $request, Label $label): RedirectResponse
    {
        $this->authorize('update', $label->board);

        $label->delete();

        return back();
    }
}

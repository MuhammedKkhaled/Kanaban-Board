<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCardRequest;
use App\Http\Requests\UpdateCardRequest;
use App\Models\Card;
use App\Models\Column;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CardController extends Controller
{
    public function store(StoreCardRequest $request, Column $column): RedirectResponse
    {
        $this->authorize('update', $column->board);

        $column->cards()->create([
            'title' => $request->validated('title'),
            'position' => (int) $column->cards()->max('position') + 1,
        ]);

        return back();
    }

    public function update(UpdateCardRequest $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card->column->board);

        $data = $request->validated();
        $card->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'due_date' => $data['due_date'] ?? null,
            'priority' => $data['priority'],
        ]);

        $card->labels()->sync($this->validatedBoardLabelIds($card, $data['label_ids'] ?? []));

        return back();
    }

    public function destroy(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card->column->board);

        $card->delete();

        return back();
    }

    public function move(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card->column->board);

        $validated = $request->validate([
            'to_column_id' => ['required', 'integer'],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $target = Column::findOrFail($validated['to_column_id']);

        // The destination column must belong to the same board the user owns.
        if ($target->board_id !== $card->column->board_id) {
            throw ValidationException::withMessages([
                'to_column_id' => 'Cannot move a card to another board.',
            ]);
        }

        DB::transaction(function () use ($card, $target, $validated) {
            $sourceColumnId = $card->column_id;

            // Pull the destination ordering without the moved card, then splice it in.
            $orderedIds = $target->cards()
                ->where('id', '!=', $card->id)
                ->orderBy('position')
                ->pluck('id')
                ->all();

            $position = min($validated['position'], count($orderedIds));
            array_splice($orderedIds, $position, 0, [$card->id]);

            $card->update(['column_id' => $target->id]);

            foreach ($orderedIds as $index => $id) {
                Card::whereKey($id)->update(['position' => $index]);
            }

            // Renumber the source column when the card changed columns.
            if ($sourceColumnId !== $target->id) {
                Card::where('column_id', $sourceColumnId)
                    ->orderBy('position')
                    ->pluck('id')
                    ->each(fn ($id, $index) => Card::whereKey($id)->update(['position' => $index]));
            }
        });

        return back();
    }

    /**
     * Restrict synced labels to those belonging to the card's board.
     *
     * @param  array<int>  $labelIds
     * @return array<int>
     */
    private function validatedBoardLabelIds(Card $card, array $labelIds): array
    {
        return $card->column->board->labels()
            ->whereIn('id', $labelIds)
            ->pluck('id')
            ->all();
    }
}

<?php

namespace Tests\Feature;

use App\Models\Board;
use App\Models\Card;
use App\Models\Column;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KanbanTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_board_with_default_columns(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('boards.store'), ['name' => 'Project X'])
            ->assertRedirect();

        $board = Board::where('user_id', $user->id)->firstOrFail();

        $this->assertSame('Project X', $board->name);
        $this->assertSame(
            ['To Do', 'In Progress', 'Done'],
            $board->columns()->orderBy('position')->pluck('name')->all(),
        );
    }

    public function test_user_can_move_a_card_to_another_column(): void
    {
        $user = User::factory()->create();
        $board = Board::factory()->for($user)->create();
        $source = Column::factory()->for($board)->create(['position' => 0]);
        $target = Column::factory()->for($board)->create(['position' => 1]);
        $card = Card::factory()->for($source, 'column')->create(['position' => 0]);
        Card::factory()->for($target, 'column')->create(['position' => 0]);

        $this->actingAs($user)
            ->post(route('cards.move', $card), [
                'to_column_id' => $target->id,
                'position' => 0,
            ])
            ->assertRedirect();

        $card->refresh();
        $this->assertSame($target->id, $card->column_id);
        $this->assertSame(0, $card->position);
        // The card that was already in the target column should now be at position 1.
        $this->assertSame(1, $target->cards()->where('id', '!=', $card->id)->first()->position);
    }

    public function test_owner_sees_board_with_nested_columns_and_cards(): void
    {
        $user = User::factory()->create();
        $board = Board::factory()->for($user)->create();
        $column = Column::factory()->for($board)->create();
        Card::factory()->for($column, 'column')->create(['title' => 'Ship it']);

        $this->actingAs($user)
            ->get(route('boards.show', $board))
            ->assertInertia(fn ($page) => $page
                ->component('Boards/Show')
                ->where('board.id', $board->id)
                ->where('board.columns.0.cards.0.title', 'Ship it')
            );
    }

    public function test_user_cannot_view_another_users_board(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $board = Board::factory()->for($owner)->create();

        $this->actingAs($intruder)
            ->get(route('boards.show', $board))
            ->assertForbidden();
    }

    public function test_user_cannot_move_another_users_card(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $board = Board::factory()->for($owner)->create();
        $source = Column::factory()->for($board)->create();
        $target = Column::factory()->for($board)->create();
        $card = Card::factory()->for($source, 'column')->create();

        $this->actingAs($intruder)
            ->post(route('cards.move', $card), [
                'to_column_id' => $target->id,
                'position' => 0,
            ])
            ->assertForbidden();
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('boards.index'))->assertRedirect(route('login'));
    }
}

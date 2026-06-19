<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Card;
use App\Models\Label;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $board = Board::factory()->create([
            'user_id' => $user->id,
            'name' => 'My First Board',
        ]);

        $labels = collect([
            ['name' => 'Bug', 'color' => '#ef4444'],
            ['name' => 'Feature', 'color' => '#3b82f6'],
            ['name' => 'Urgent', 'color' => '#f59e0b'],
        ])->map(fn ($attrs) => Label::factory()->create([...$attrs, 'board_id' => $board->id]));

        $columnNames = ['To Do', 'In Progress', 'Done'];

        foreach ($columnNames as $index => $name) {
            $column = $board->columns()->create([
                'name' => $name,
                'position' => $index,
            ]);

            Card::factory()
                ->count(3)
                ->sequence(fn ($sequence) => ['position' => $sequence->index])
                ->create(['column_id' => $column->id])
                ->each(fn (Card $card) => $card->labels()->attach(
                    $labels->random(rand(0, 2))->pluck('id')->all()
                ));
        }
    }
}

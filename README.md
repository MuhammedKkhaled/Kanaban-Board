<h1 align="center">Kanban Todo</h1>

<p align="center">A multi-user Kanban board app built with <b>Laravel 12</b> + <b>React</b> over <b>Inertia.js</b>.</p>

---

## Description

Kanban Todo is a personal task-management app where each user manages their own boards. A board is a set of ordered columns (e.g. *To Do → In Progress → Done*), and each column holds cards. Cards carry a title, description, due date, priority, and color labels, and can be dragged between and within columns. Everything is private per user.

It is a **monolith** — Laravel renders React pages directly through Inertia, so there is no separate REST API or client-side router. Authentication, routing, and data flow all run through the standard Laravel session.

## Features

- **Authentication** — register / login / logout / profile (Laravel Breeze, React preset).
- **Multiple boards** per user, each created with default columns.
- **Custom columns** — add, rename (double-click), delete, and drag to reorder.
- **Cards** — create, edit, delete, with description, due date, priority (low / medium / high), and labels.
- **Labels** — board-scoped, color-coded tags managed from the board.
- **Drag & drop** — move cards within and across columns and reorder columns, with order persisted to the database.
- **Per-user isolation** — every action is authorized so users only ever touch their own data.
- **Polished UI** — entrance/stagger animations, press feedback, and reduced-motion support.

## Tech Stack

| Layer        | Technology                                                  |
| ------------ | ----------------------------------------------------------- |
| Backend      | Laravel 12, PHP 8.2+                                         |
| Frontend     | React 18 + Inertia.js, Vite                                 |
| Styling      | Tailwind CSS v3                                              |
| Drag & drop  | @dnd-kit                                                     |
| Auth         | Laravel Breeze (React scaffold)                             |
| Database     | MySQL (app) · in-memory SQLite (tests)                      |

## Architecture (abstracted layers)

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation        React pages (resources/js/Pages)          │
│                      Inertia renders pages with server props;   │
│                      @dnd-kit handles drag interactions.        │
├─────────────────────────────────────────────────────────────┤
│  Transport           Inertia visits (router.post/patch/delete)  │
│                      over the Laravel session — no REST/fetch.  │
├─────────────────────────────────────────────────────────────┤
│  Routing             routes/web.php (auth-guarded) + auth.php   │
├─────────────────────────────────────────────────────────────┤
│  Validation          FormRequest classes (app/Http/Requests)   │
├─────────────────────────────────────────────────────────────┤
│  Authorization       BoardPolicy — nested resources authorize   │
│                      through their parent board's owner.        │
├─────────────────────────────────────────────────────────────┤
│  Controllers         Board / Column / Card / Label controllers; │
│                      ordering changes wrapped in DB transactions.│
├─────────────────────────────────────────────────────────────┤
│  Domain (Eloquent)   Board · Column · Card · Label models       │
├─────────────────────────────────────────────────────────────┤
│  Persistence         Migrations → MySQL                         │
└─────────────────────────────────────────────────────────────┘
```

### Request / data flow

1. User visits an auth-guarded route in `routes/web.php`.
2. The controller loads the user's data and calls `Inertia::render('Page', $props)`.
3. Inertia returns the matching React page in `resources/js/Pages/` with those props.
4. A user action (create card, drag, edit…) issues an Inertia visit to a controller.
5. A **FormRequest** validates input; the **BoardPolicy** authorizes it via board ownership.
6. The controller mutates the database (ordering changes run inside a transaction) and returns a redirect/`back()`, which re-renders fresh props.
7. Drag operations update local React state optimistically, then persist via `cards.move` / `columns.reorder`.

## Data Model

```
User ──< Board ──< Column ──< Card >──< Label
                    │                    │
                    └────────── Board ───┘   (labels are board-scoped)
```

- **User** `1—*` **Board** — a user owns many boards.
- **Board** `1—*` **Column** — ordered by `position`.
- **Column** `1—*` **Card** — ordered by `position`.
- **Card** `*—*` **Label** — via the `card_label` pivot.
- **Board** `1—*` **Label** — labels belong to a board and are shared across its cards.

Card/column order is stored as integer `position` columns; the `move` and `reorder` endpoints renumber siblings transactionally to keep positions consistent.

## Database Schema (migrations)

| Table        | Key columns                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| `boards`     | `user_id` (FK→users, cascade), `name`                                                |
| `columns`    | `board_id` (FK→boards, cascade), `name`, `position`                                  |
| `cards`      | `column_id` (FK→columns, cascade), `title`, `description`, `due_date`, `priority` (enum: low/medium/high), `position` |
| `labels`     | `board_id` (FK→boards, cascade), `name`, `color` (hex)                               |
| `card_label` | `card_id` + `label_id` (composite PK, both cascade)                                  |

Foreign keys cascade on delete, so removing a board cleanly removes its columns, cards, labels, and pivot rows. Migrations are time-suffix ordered so each FK target exists before the table that references it.

## Getting Started

```bash
# 1. Install dependencies
composer install
npm install

# 2. Configure environment (DB credentials live in .env)
cp .env.example .env        # if needed
php artisan key:generate

# 3. Build the schema and seed a demo board
php artisan migrate:fresh --seed

# 4. Run everything (server + queue + logs + Vite)
composer run dev
```

Seeded demo login: **test@example.com** / **password**.

## Project Structure

```
app/
  Http/Controllers/   Board, Column, Card, Label controllers
  Http/Requests/      FormRequest validation
  Models/             Board, Column, Card, Label, User
  Policies/           BoardPolicy
database/
  migrations/         boards → columns → cards → labels → card_label
  seeders/            DatabaseSeeder (demo board + columns + cards + labels)
resources/js/
  Pages/Boards/       Index (board grid), Show (the board + drag & drop)
  Components/Kanban/   BoardColumn, KanbanCard, CardModal, LabelManager
  Layouts/            AuthenticatedLayout (Breeze)
routes/
  web.php             App routes (auth-guarded)
  auth.php            Breeze auth routes
tests/Feature/        KanbanTest (CRUD, card move, authorization)
```

## Testing

```bash
php artisan test                       # full suite (in-memory SQLite)
php artisan test --filter=KanbanTest   # Kanban feature tests
```

`KanbanTest` covers board creation with default columns, card moves with repositioning, board rendering with nested data, and cross-user authorization (a user cannot view or move another user's data).

## License

Open-sourced under the [MIT license](https://opensource.org/licenses/MIT).

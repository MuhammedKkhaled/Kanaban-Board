# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A multi-user Kanban Todo app: **Laravel 12 + React via Inertia.js** (a monolith — no separate REST API). Auth is Laravel Breeze (React preset). Styling is **Tailwind CSS v3** (Breeze downgraded the skeleton's v4 — see note below). Drag-and-drop uses **@dnd-kit**.

## Commands

```bash
composer run dev        # Runs server + queue + pail logs + vite concurrently (primary dev command)
php artisan serve       # Laravel server only (assets must be built or vite running separately)
npm run dev             # Vite dev server only
npm run build           # Production asset build — run after JS/CSS changes to verify they compile

php artisan test                          # Full PHPUnit suite (in-memory SQLite, see below)
php artisan test --filter=KanbanTest      # Single test class
php artisan test --filter=test_user_can_move_a_card_to_another_column   # Single test method

./vendor/bin/pint --dirty   # PHP code style fixer (changed files only)

php artisan migrate:fresh --seed   # Rebuild MySQL schema + demo board/columns/cards/labels
```

Seeded login: **test@example.com / password**.

## Environment quirks

- **App DB is MySQL** (`kanabanApp_DB`, configured in `.env`), but **tests run on in-memory SQLite** (forced in `phpunit.xml`). Keep migrations portable — `enum()` works on both, but avoid MySQL-only schema. There is no MySQL test database; never point tests at MySQL.
- **Tailwind is v3, not v4.** `tailwind.config.js` + `postcss.config.js` drive it; `resources/css/app.css` uses `@tailwind` directives. The unused `@tailwindcss/vite` v4 dep lingers in `package.json` — ignore it; do not reintroduce v4 `@import "tailwindcss"` syntax.

## Architecture

**Request flow:** Laravel controller → `Inertia::render('Page/Name', $props)` → React page in `resources/js/Pages/`. No fetch/axios glue; mutations are Inertia visits (`router.post/patch/delete` or `useForm`) that return `back()`/redirects and re-render props.

**Domain model** (`app/Models/`): `User hasMany Board hasMany Column hasMany Card`; `Card belongsToMany Label`; `Board hasMany Label`. Ordering is driven by integer `position` columns on `columns` and `cards`; the `columns()`/`cards()` relations are pre-sorted by `position`.

**Authorization:** every board-scoped action authorizes through `BoardPolicy` (auto-discovered). Nested resources (column/card/label) authorize via their parent board's ownership — e.g. `$this->authorize('update', $card->column->board)`. There is no per-column/card policy. The base `app/Http/Controllers/Controller.php` includes the `AuthorizesRequests` trait (Laravel 12 doesn't by default) — keep it.

**Positioning logic is the subtle part.** `CardController::move` and `ColumnController::reorder` rewrite `position` integers inside a DB transaction. `move` splices the card into the destination column's ordering (excluding itself), clamps the index, then renumbers; it rejects moving a card to a column on a different board. When changing this, mirror the same splice/renumber approach on the React side (`Boards/Show.jsx` `handleDragEnd`) so optimistic UI and server stay consistent.

**Migration ordering:** the domain migrations share a date and are ordered by an incrementing time suffix (`190155`→`190159`) so FK targets exist before referencing tables (boards → columns → cards → labels → card_label). Preserve this ordering when adding FKs.

### Frontend structure

- `resources/js/Pages/Boards/Index.jsx` — board grid + create/delete.
- `resources/js/Pages/Boards/Show.jsx` — the board. Owns all `@dnd-kit` orchestration: one `DndContext`, a horizontal `SortableContext` of columns, a vertical one per column. Holds `columns` in local state mirrored from the `board` prop via `useEffect(..., [board])` for optimistic drag updates. Drag types are distinguished by `active.data.current.type` (`'card'` vs `'column'`); droppable/sortable ids are namespaced (`column-${id}`, `column-drop-${id}`) and resolved in `resolveColumnId`.
- `resources/js/Components/Kanban/` — `BoardColumn`, `KanbanCard`, `CardModal`, `LabelManager`.
- Breeze-provided shells/components (`Layouts/AuthenticatedLayout.jsx`, `Components/Modal.jsx`, buttons) are reused — extend these rather than adding parallel ones.

### UI/animation conventions

The UI follows the `emil-design-eng` philosophy. When adding/changing UI, keep it consistent: custom easings `ease-out-strong` / `ease-in-out-strong` and the `card-in` / `column-in` keyframes are defined in `tailwind.config.js`; pressable elements use `active:scale-[0.97]`; transitions name exact properties (never `transition: all`); `@media (prefers-reduced-motion)` handling lives in `app.css`. Avoid `ease-in` and never animate from `scale(0)`.

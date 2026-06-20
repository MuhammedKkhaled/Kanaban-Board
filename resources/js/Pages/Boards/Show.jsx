import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import BoardColumn from '@/Components/Kanban/BoardColumn';
import CardModal from '@/Components/Kanban/CardModal';
import KanbanCard from '@/Components/Kanban/KanbanCard';
import LabelManager from '@/Components/Kanban/LabelManager';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Show({ board }) {
    const [columns, setColumns] = useState(board.columns);
    const [activeCard, setActiveCard] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [managingLabels, setManagingLabels] = useState(false);
    const [addingColumn, setAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [deletingCard, setDeletingCard] = useState(null);
    const deleteCardForm = useForm();

    // Re-sync local state whenever the server sends a fresh board (create/edit/delete).
    useEffect(() => setColumns(board.columns), [board]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const columnSortableIds = columns.map((c) => `column-${c.id}`);

    function resolveColumnId(overId) {
        if (typeof overId === 'number') {
            return columns.find((c) => c.cards.some((card) => card.id === overId))?.id ?? null;
        }
        if (typeof overId === 'string') {
            if (overId.startsWith('column-drop-')) return Number(overId.slice(12));
            if (overId.startsWith('column-')) return Number(overId.slice(7));
        }
        return null;
    }

    function findCard(cardId) {
        for (const column of columns) {
            const card = column.cards.find((c) => c.id === cardId);
            if (card) return card;
        }
        return null;
    }

    function handleDragStart(event) {
        if (event.active.data.current?.type === 'card') {
            setActiveCard(findCard(event.active.id));
        }
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveCard(null);
        if (!over) return;

        // Reorder columns.
        if (active.data.current?.type === 'column') {
            if (active.id === over.id) return;
            const oldIndex = columns.findIndex((c) => `column-${c.id}` === active.id);
            const newIndex = columns.findIndex((c) => `column-${c.id}` === over.id);
            if (oldIndex < 0 || newIndex < 0) return;

            const reordered = arrayMove(columns, oldIndex, newIndex);
            setColumns(reordered);
            router.patch(
                route('columns.reorder', board.id),
                { columns: reordered.map((c) => c.id) },
                { preserveState: true, preserveScroll: true },
            );
            return;
        }

        // Move a card.
        const cardId = active.id;
        const fromColumn = columns.find((c) => c.cards.some((card) => card.id === cardId));
        const toColumnId = resolveColumnId(over.id);
        if (!fromColumn || toColumnId == null) return;

        const toColumn = columns.find((c) => c.id === toColumnId);
        let targetIndex =
            typeof over.id === 'number'
                ? toColumn.cards.findIndex((c) => c.id === over.id)
                : toColumn.cards.length;
        if (targetIndex < 0) targetIndex = toColumn.cards.length;

        let next;
        if (fromColumn.id === toColumnId) {
            const oldIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
            if (oldIndex === targetIndex) return;
            next = columns.map((c) =>
                c.id === toColumnId
                    ? { ...c, cards: arrayMove(c.cards, oldIndex, targetIndex) }
                    : c,
            );
        } else {
            const card = fromColumn.cards.find((c) => c.id === cardId);
            next = columns.map((c) => {
                if (c.id === fromColumn.id) {
                    return { ...c, cards: c.cards.filter((x) => x.id !== cardId) };
                }
                if (c.id === toColumnId) {
                    const cards = [...c.cards];
                    cards.splice(targetIndex, 0, { ...card, column_id: toColumnId });
                    return { ...c, cards };
                }
                return c;
            });
        }

        setColumns(next);

        const finalIndex = next
            .find((c) => c.id === toColumnId)
            .cards.findIndex((c) => c.id === cardId);

        router.post(
            route('cards.move', cardId),
            { to_column_id: toColumnId, position: finalIndex },
            { preserveState: true, preserveScroll: true },
        );
    }

    function addCard(column, title) {
        router.post(route('cards.store', column.id), { title }, { preserveScroll: true });
    }

    function renameColumn(column, name) {
        router.patch(route('columns.update', column.id), { name }, { preserveScroll: true });
    }

    function deleteColumn(column) {
        if (confirm(`Delete column "${column.name}" and its cards?`)) {
            router.delete(route('columns.destroy', column.id), { preserveScroll: true });
        }
    }

    function confirmDeleteCard() {
        deleteCardForm.delete(route('cards.destroy', deletingCard.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingCard(null),
        });
    }

    function createColumn(event) {
        event.preventDefault();
        const name = newColumnName.trim();
        if (name) {
            router.post(route('columns.store', board.id), { name }, { preserveScroll: true });
        }
        setNewColumnName('');
        setAddingColumn(false);
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('boards.index')}
                            className="text-gray-400 transition-colors duration-150 ease-out-strong hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                            ←
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                            {board.name}
                        </h2>
                    </div>
                    <button
                        onClick={() => setManagingLabels(true)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-gray-50 active:scale-[0.97] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Manage labels
                    </button>
                </div>
            }
        >
            <Head title={board.name} />

            <div className="h-[calc(100vh-8rem)] overflow-x-auto p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex items-start gap-4">
                        <SortableContext
                            items={columnSortableIds}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((column, index) => (
                                <BoardColumn
                                    key={column.id}
                                    column={column}
                                    index={index}
                                    onCardClick={setEditingCard}
                                    onAddCard={addCard}
                                    onRename={renameColumn}
                                    onDelete={deleteColumn}
                                    onDeleteCard={setDeletingCard}
                                />
                            ))}
                        </SortableContext>

                        <div className="w-72 shrink-0">
                            {addingColumn ? (
                                <form onSubmit={createColumn} className="rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
                                    <input
                                        autoFocus
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                        onBlur={createColumn}
                                        onKeyDown={(e) => e.key === 'Escape' && setAddingColumn(false)}
                                        placeholder="Column name…"
                                        className="w-full rounded border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                                    />
                                </form>
                            ) : (
                                <button
                                    onClick={() => setAddingColumn(true)}
                                    className="w-full rounded-xl border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-[transform,color,border-color] duration-150 ease-out-strong hover:border-gray-400 hover:text-gray-700 active:scale-[0.98] dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200"
                                >
                                    + Add column
                                </button>
                            )}
                        </div>
                    </div>

                    <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
                        {activeCard ? (
                            <KanbanCard card={activeCard} onClick={() => {}} isOverlay />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <CardModal
                card={editingCard}
                labels={board.labels}
                onClose={() => setEditingCard(null)}
            />

            <LabelManager
                show={managingLabels}
                board={board}
                labels={board.labels}
                onClose={() => setManagingLabels(false)}
            />

            <DeleteConfirmModal
                show={!!deletingCard}
                title="Delete card?"
                description={
                    deletingCard
                        ? `"${deletingCard.title}" will be permanently deleted. This action can't be undone.`
                        : ''
                }
                confirmLabel="Delete card"
                processing={deleteCardForm.processing}
                onConfirm={confirmDeleteCard}
                onClose={() => setDeletingCard(null)}
            />
        </AuthenticatedLayout>
    );
}

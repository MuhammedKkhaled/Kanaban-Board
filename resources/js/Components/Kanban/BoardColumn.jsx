import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import KanbanCard from './KanbanCard';

export default function BoardColumn({ column, index = 0, onCardClick, onAddCard, onRename, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(column.name);
    const [adding, setAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: `column-${column.id}`, data: { type: 'column', columnId: column.id } });

    // Droppable target so cards can be dropped into an empty column.
    const { setNodeRef: setDropRef } = useDroppable({
        id: `column-drop-${column.id}`,
        data: { type: 'column', columnId: column.id },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        // Stagger column entrance; skip the delay once dragging to avoid replays.
        animationDelay: `${Math.min(index, 6) * 40}ms`,
    };

    const cardIds = column.cards.map((card) => card.id);

    function submitRename() {
        const trimmed = name.trim();
        if (trimmed && trimmed !== column.name) {
            onRename(column, trimmed);
        } else {
            setName(column.name);
        }
        setEditing(false);
    }

    function submitNewCard(event) {
        event.preventDefault();
        const trimmed = newTitle.trim();
        if (trimmed) {
            onAddCard(column, trimmed);
            setNewTitle('');
        }
        setAdding(false);
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="animate-column-in flex w-72 shrink-0 flex-col rounded-xl bg-gray-100 dark:bg-gray-800"
        >
            <div className="flex items-center justify-between gap-2 px-3 py-2">
                {editing ? (
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={submitRename}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename();
                            if (e.key === 'Escape') {
                                setName(column.name);
                                setEditing(false);
                            }
                        }}
                        className="w-full rounded border-gray-300 px-2 py-1 text-sm font-semibold dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                ) : (
                    <button
                        {...attributes}
                        {...listeners}
                        onDoubleClick={() => setEditing(true)}
                        className="flex flex-1 cursor-grab items-center gap-2 text-left text-sm font-semibold text-gray-700 active:cursor-grabbing dark:text-gray-200"
                        title="Drag to reorder · double-click to rename"
                    >
                        {column.name}
                        <span className="rounded-full bg-gray-200 px-2 text-xs font-normal text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            {column.cards.length}
                        </span>
                    </button>
                )}
                <button
                    onClick={() => onDelete(column)}
                    className="rounded text-gray-400 transition-colors duration-150 ease-out-strong hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    title="Delete column"
                >
                    ✕
                </button>
            </div>

            <div ref={setDropRef} className="flex flex-1 flex-col gap-2 px-2 pb-2">
                <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                    {column.cards.map((card) => (
                        <KanbanCard key={card.id} card={card} onClick={onCardClick} />
                    ))}
                </SortableContext>

                {adding ? (
                    <form onSubmit={submitNewCard}>
                        <textarea
                            autoFocus
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) submitNewCard(e);
                                if (e.key === 'Escape') setAdding(false);
                            }}
                            onBlur={() => setAdding(false)}
                            placeholder="Card title…"
                            className="w-full resize-none rounded-lg border-gray-300 p-2 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                            rows={2}
                        />
                    </form>
                ) : (
                    <button
                        onClick={() => setAdding(true)}
                        className="rounded-lg px-2 py-1.5 text-left text-sm text-gray-500 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-gray-200 active:scale-[0.98] dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        + Add a card
                    </button>
                )}
            </div>
        </div>
    );
}

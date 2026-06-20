import AnimatedTrashIcon from '@/Components/AnimatedTrashIcon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITY_STYLES = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function KanbanCard({ card, onClick, onDelete, isOverlay = false }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id, data: { type: 'card', columnId: card.column_id } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const due = formatDate(card.due_date);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(card)}
            className={`group relative animate-card-in cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out-strong hover:border-gray-300 hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-700/80 dark:hover:border-gray-500 ${
                isOverlay
                    ? 'rotate-3 scale-[1.02] cursor-grabbing shadow-xl ring-1 ring-black/5 dark:ring-white/10'
                    : ''
            }`}
        >
            {onDelete && !isOverlay && (
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(card);
                    }}
                    aria-label={`Delete card ${card.title}`}
                    title="Delete card"
                    className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-red-400 opacity-60 transition-[transform,background-color,color,opacity] duration-150 ease-out-strong hover:bg-red-50 hover:text-red-600 hover:opacity-100 focus:opacity-100 focus:outline-none active:scale-90 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                >
                    <AnimatedTrashIcon className="h-3.5 w-3.5" />
                </button>
            )}

            <p className="pr-6 text-sm font-medium text-gray-800 dark:text-gray-100">
                {card.title}
            </p>

            {card.labels?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {card.labels.map((label) => (
                        <span
                            key={label.id}
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                            style={{ backgroundColor: label.color }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-2 flex items-center gap-2">
                <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize ${PRIORITY_STYLES[card.priority]}`}
                >
                    {card.priority}
                </span>
                {due && (
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        📅 {due}
                    </span>
                )}
            </div>
        </div>
    );
}

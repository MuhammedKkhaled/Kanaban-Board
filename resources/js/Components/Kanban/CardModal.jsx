import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

function toDateInput(value) {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
}

export default function CardModal({ card, labels, onClose }) {
    const { data, setData, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        label_ids: [],
    });

    useEffect(() => {
        if (card) {
            setData({
                title: card.title ?? '',
                description: card.description ?? '',
                due_date: toDateInput(card.due_date),
                priority: card.priority ?? 'medium',
                label_ids: (card.labels ?? []).map((l) => l.id),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card]);

    function save(event) {
        event.preventDefault();
        patch(route('cards.update', card.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    }

    function remove() {
        destroy(route('cards.destroy', card.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    function toggleLabel(id) {
        setData(
            'label_ids',
            data.label_ids.includes(id)
                ? data.label_ids.filter((x) => x !== id)
                : [...data.label_ids, id],
        );
    }

    return (
        <Modal show={!!card} onClose={onClose}>
            {card && (
                <form onSubmit={save} className="space-y-4 p-6">
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="due_date" value="Due date" />
                            <TextInput
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="priority" value="Priority" />
                            <select
                                id="priority"
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {labels.length > 0 && (
                        <div>
                            <InputLabel value="Labels" />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {labels.map((label) => {
                                    const active = data.label_ids.includes(label.id);
                                    return (
                                        <button
                                            type="button"
                                            key={label.id}
                                            onClick={() => toggleLabel(label.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-[transform,background-color,box-shadow] duration-150 ease-out-strong active:scale-[0.97] ${active ? 'text-white' : 'text-gray-600 ring-1 ring-inset ring-gray-300 hover:ring-gray-400'}`}
                                            style={active ? { backgroundColor: label.color } : {}}
                                        >
                                            {label.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <DangerButton type="button" onClick={remove} disabled={processing}>
                            Delete
                        </DangerButton>
                        <div className="flex gap-2">
                            <SecondaryButton type="button" onClick={onClose}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        </div>
                    </div>
                </form>
            )}
        </Modal>
    );
}

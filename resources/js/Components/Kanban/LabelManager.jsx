import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router, useForm } from '@inertiajs/react';

const PALETTE = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];

export default function LabelManager({ show, board, labels, onClose }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        color: PALETTE[0],
    });

    function create(event) {
        event.preventDefault();
        post(route('labels.store', board.id), {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    }

    function remove(label) {
        router.delete(route('labels.destroy', label.id), { preserveScroll: true });
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Manage labels
                </h2>

                <div className="space-y-2">
                    {labels.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No labels yet.
                        </p>
                    )}
                    {labels.map((label) => (
                        <div key={label.id} className="flex items-center justify-between">
                            <span
                                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                style={{ backgroundColor: label.color }}
                            >
                                {label.name}
                            </span>
                            <button
                                onClick={() => remove(label)}
                                className="text-sm text-gray-400 transition-colors duration-150 ease-out-strong hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={create} className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="New label name"
                        className="block w-full"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}

                    <div className="flex gap-2">
                        {PALETTE.map((color) => (
                            <button
                                type="button"
                                key={color}
                                onClick={() => setData('color', color)}
                                className={`h-6 w-6 rounded-full transition-transform duration-150 ease-out-strong active:scale-90 ${data.color === color ? 'ring-2 ring-gray-800 ring-offset-2 dark:ring-gray-200 dark:ring-offset-gray-800' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>Add label</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

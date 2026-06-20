import AnimatedTrashIcon from '@/Components/AnimatedTrashIcon';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ boards }) {
    const [creating, setCreating] = useState(false);
    const [deletingBoard, setDeletingBoard] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });
    const deleteForm = useForm();

    function create(event) {
        event.preventDefault();
        post(route('boards.store'), {
            onSuccess: () => {
                reset();
                setCreating(false);
            },
        });
    }

    function confirmDelete() {
        deleteForm.delete(route('boards.destroy', deletingBoard.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingBoard(null),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    Boards
                </h2>
            }
        >
            <Head title="Boards" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {boards.map((board, index) => (
                            <div
                                key={board.id}
                                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                                className="group relative animate-card-in rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out-strong hover:-translate-y-1 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                            >
                                <Link
                                    href={route('boards.show', board.id)}
                                    className="block pr-9"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        {board.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {board.columns_count} column
                                        {board.columns_count === 1 ? '' : 's'}
                                    </p>
                                </Link>
                                <button
                                    onClick={() => setDeletingBoard(board)}
                                    className="absolute right-2.5 top-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-red-50 hover:text-red-600 active:scale-90 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                    aria-label={`Delete board ${board.name}`}
                                    title="Delete board"
                                >
                                    <AnimatedTrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => setCreating(true)}
                            className="flex min-h-[96px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-[transform,color,border-color] duration-150 ease-out-strong hover:border-gray-400 hover:text-gray-700 active:scale-[0.98] dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200"
                        >
                            + New board
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={creating} onClose={() => setCreating(false)} maxWidth="md">
                <form onSubmit={create} className="space-y-4 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Create a board
                    </h2>
                    <TextInput
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Board name"
                        className="block w-full"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setCreating(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>Create</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmModal
                show={!!deletingBoard}
                title="Delete board?"
                description={
                    deletingBoard
                        ? `"${deletingBoard.name}" and all of its columns and cards will be permanently deleted. This action can't be undone.`
                        : ''
                }
                confirmLabel="Delete board"
                processing={deleteForm.processing}
                onConfirm={confirmDelete}
                onClose={() => setDeletingBoard(null)}
            />
        </AuthenticatedLayout>
    );
}

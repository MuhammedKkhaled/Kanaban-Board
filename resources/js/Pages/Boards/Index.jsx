import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ boards }) {
    const [creating, setCreating] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    function create(event) {
        event.preventDefault();
        post(route('boards.store'), {
            onSuccess: () => {
                reset();
                setCreating(false);
            },
        });
    }

    function destroy(board) {
        if (confirm(`Delete board "${board.name}"? This cannot be undone.`)) {
            router.delete(route('boards.destroy', board.id), { preserveScroll: true });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
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
                                className="group relative animate-card-in rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out-strong hover:-translate-y-1 hover:border-gray-300 hover:shadow-md"
                            >
                                <Link
                                    href={route('boards.show', board.id)}
                                    className="block"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {board.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {board.columns_count} column
                                        {board.columns_count === 1 ? '' : 's'}
                                    </p>
                                </Link>
                                <button
                                    onClick={() => destroy(board)}
                                    className="absolute right-3 top-3 text-gray-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                                    title="Delete board"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => setCreating(true)}
                            className="flex min-h-[96px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-[transform,color,border-color] duration-150 ease-out-strong hover:border-gray-400 hover:text-gray-700 active:scale-[0.98]"
                        >
                            + New board
                        </button>
                    </div>
                </div>
            </div>

            <Modal show={creating} onClose={() => setCreating(false)} maxWidth="md">
                <form onSubmit={create} className="space-y-4 p-6">
                    <h2 className="text-lg font-semibold text-gray-800">
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
                        <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setCreating(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>Create</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

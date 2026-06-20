import AnimatedTrashIcon from '@/Components/AnimatedTrashIcon';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

/**
 * Reusable destructive-confirmation dialog with an animated trash icon.
 * The lid plays a one-shot lift on open, and lifts again while the user
 * hovers the Delete button (anticipation before the irreversible action).
 */
export default function DeleteConfirmModal({
    show,
    title = 'Delete?',
    description,
    confirmLabel = 'Delete',
    processing = false,
    onConfirm,
    onClose,
}) {
    const [armed, setArmed] = useState(false);

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <AnimatedTrashIcon
                        animate
                        open={armed}
                        className="h-8 w-8 text-red-600 dark:text-red-400"
                    />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h2>

                {description && (
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}

                <div className="mt-6 flex justify-center gap-3">
                    <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                        Cancel
                    </SecondaryButton>
                    <DangerButton
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        onMouseEnter={() => setArmed(true)}
                        onMouseLeave={() => setArmed(false)}
                        onFocus={() => setArmed(true)}
                        onBlur={() => setArmed(false)}
                    >
                        {processing ? 'Deleting…' : confirmLabel}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}

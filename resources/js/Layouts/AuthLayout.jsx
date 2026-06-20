import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

/**
 * Split-screen auth shell: a branded Kanban panel on the left (lg+),
 * the form on the right with a staggered entrance.
 */
export default function AuthLayout({ title, subtitle, children, alt }) {
    return (
        <div className="relative flex min-h-screen bg-white dark:bg-gray-900">
            <div className="absolute right-4 top-4 z-10">
                <ThemeToggle />
            </div>

            {/* Brand panel */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gray-900 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-gray-900 to-gray-950" />

                {/* Decorative mini board */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-4 opacity-90">
                        {[
                            { label: 'To Do', cards: 3, delay: 0 },
                            { label: 'In Progress', cards: 2, delay: 200 },
                            { label: 'Done', cards: 2, delay: 400 },
                        ].map((col) => (
                            <div
                                key={col.label}
                                className="animate-float w-40 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-sm"
                                style={{ animationDelay: `${col.delay}ms` }}
                            >
                                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                                    {col.label}
                                </div>
                                <div className="space-y-2">
                                    {Array.from({ length: col.cards }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg bg-white/90 p-2.5 shadow-sm"
                                        >
                                            <div className="h-2 w-3/4 rounded-full bg-gray-300" />
                                            <div className="mt-2 flex gap-1">
                                                <div className="h-1.5 w-8 rounded-full bg-indigo-300" />
                                                <div className="h-1.5 w-5 rounded-full bg-gray-200" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                    <Link href="/" className="text-lg font-bold text-white">
                        📋 Kanban Todo
                    </Link>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                        Organize your work into boards, columns, and cards — and drag
                        them wherever they belong.
                    </p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <Link
                        href="/"
                        className="animate-card-in mb-8 inline-block text-lg font-bold text-gray-900 dark:text-gray-100 lg:hidden"
                    >
                        📋 Kanban Todo
                    </Link>

                    <h1
                        className="animate-card-in text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
                        style={{ animationDelay: '40ms' }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p
                            className="animate-card-in mt-2 text-sm text-gray-500 dark:text-gray-400"
                            style={{ animationDelay: '80ms' }}
                        >
                            {subtitle}
                        </p>
                    )}

                    <div className="mt-8">{children}</div>

                    {alt && (
                        <p
                            className="animate-card-in mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
                            style={{ animationDelay: '320ms' }}
                        >
                            {alt.text}{' '}
                            <Link
                                href={alt.href}
                                className="font-semibold text-indigo-600 transition-colors duration-150 ease-out-strong hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                {alt.label}
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

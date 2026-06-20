import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';

const FEATURES = [
    {
        icon: '🗂️',
        title: 'Multiple boards',
        body: 'Spin up a board for every project and keep each workspace focused.',
    },
    {
        icon: '🖐️',
        title: 'Drag & drop',
        body: 'Move cards across columns and reorder them — order is saved instantly.',
    },
    {
        icon: '🏷️',
        title: 'Cards with detail',
        body: 'Descriptions, due dates, priorities, and color labels on every card.',
    },
    {
        icon: '🔒',
        title: 'Private by default',
        body: 'Each account only ever sees its own boards. Nothing leaks across users.',
    },
];

const MOCK_COLUMNS = [
    {
        name: 'To Do',
        cards: [
            { title: 'Design landing page', tag: 'Design', tagColor: '#8b5cf6' },
            { title: 'Set up database schema', tag: 'Backend', tagColor: '#3b82f6' },
        ],
    },
    {
        name: 'In Progress',
        cards: [{ title: 'Build drag & drop', tag: 'Feature', tagColor: '#10b981' }],
    },
    {
        name: 'Done',
        cards: [
            { title: 'Auth system', tag: 'Done', tagColor: '#6b7280' },
            { title: 'Project setup', tag: 'Chore', tagColor: '#f59e0b' },
        ],
    },
];

function CtaButtons({ className = '' }) {
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <Link
                href={route('register')}
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,background-color] duration-150 ease-out-strong hover:bg-gray-800 active:scale-[0.97] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
                Get started — it's free
            </Link>
            <Link
                href={route('login')}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-gray-50 active:scale-[0.97] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Log in
            </Link>
        </div>
    );
}

function MockBoard() {
    let cardIndex = 0;
    return (
        <div className="flex gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-xl shadow-gray-200/50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30">
            {MOCK_COLUMNS.map((column, col) => (
                <div
                    key={column.name}
                    className="animate-column-in w-44 shrink-0 rounded-xl bg-gray-100 p-2.5 dark:bg-gray-900/60"
                    style={{ animationDelay: `${col * 80}ms` }}
                >
                    <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {column.name}
                        </span>
                        <span className="rounded-full bg-gray-200 px-1.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            {column.cards.length}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {column.cards.map((card) => {
                            const delay = 240 + cardIndex++ * 70;
                            return (
                                <div
                                    key={card.title}
                                    className="animate-card-in rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                    style={{ animationDelay: `${delay}ms` }}
                                >
                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100">
                                        {card.title}
                                    </p>
                                    <span
                                        className="mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                                        style={{ backgroundColor: card.tagColor }}
                                    >
                                        {card.tag}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <Head title="Kanban Todo — Organize your work" />

            {/* Nav */}
            <header className="animate-fade-in mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <span className="text-lg font-bold">📋 Kanban Todo</span>
                <nav className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link
                        href={route('login')}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors duration-150 ease-out-strong hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route('register')}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out-strong hover:bg-gray-800 active:scale-[0.97] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        Sign up
                    </Link>
                </nav>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b from-indigo-100/60 to-transparent blur-3xl dark:from-indigo-500/10" />

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
                    <div>
                        <span className="animate-card-in inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            ⚡ Laravel + React + Inertia
                        </span>
                        <h1
                            className="animate-rise-in mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
                            style={{ animationDelay: '60ms' }}
                        >
                            Organize everything,
                            <br />
                            <span className="text-indigo-600 dark:text-indigo-400">
                                one card at a time.
                            </span>
                        </h1>
                        <p
                            className="animate-rise-in mt-5 max-w-md text-lg leading-relaxed text-gray-500 dark:text-gray-400"
                            style={{ animationDelay: '140ms' }}
                        >
                            A clean, fast Kanban board for your todos. Create boards,
                            drag cards between columns, and keep every project moving.
                        </p>
                        <div className="animate-rise-in mt-8" style={{ animationDelay: '220ms' }}>
                            <CtaButtons />
                        </div>
                    </div>

                    {/* Hero visual */}
                    <div className="animate-float lg:justify-self-end">
                        <MockBoard />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
                        Everything you need to stay organized
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-center text-gray-500 dark:text-gray-400">
                        No clutter, no learning curve — just the essentials done well.
                    </p>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-200 ease-out-strong hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="text-3xl">{feature.icon}</div>
                                <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {feature.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-8 py-16 text-center dark:ring-1 dark:ring-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-transparent" />
                    <div className="relative">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Ready to get organized?
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-gray-300">
                            Create your first board in seconds. No credit card, no setup.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-transform duration-150 ease-out-strong hover:bg-gray-100 active:scale-[0.97]"
                            >
                                Get started — it's free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-gray-800">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                        📋 Kanban Todo
                    </span>
                    <span>Built with Laravel, React & Inertia.</span>
                </div>
            </footer>
        </div>
    );
}

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-gray-100 hover:text-gray-700 active:scale-90 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 ${className}`}
        >
            <span className="relative block h-5 w-5">
                {/* Sun — shown in dark mode (click to go light) */}
                <svg
                    className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-200 ease-out-strong ${
                        isDark
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-50 opacity-0'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                {/* Moon — shown in light mode (click to go dark) */}
                <svg
                    className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-200 ease-out-strong ${
                        isDark
                            ? 'rotate-90 scale-50 opacity-0'
                            : 'rotate-0 scale-100 opacity-100'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </span>
        </button>
    );
}

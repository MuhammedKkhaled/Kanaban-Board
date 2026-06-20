/**
 * A trash icon whose lid is a separate, hinged group so it can open.
 *
 * - `animate`: play the one-shot lift/wiggle/settle on mount (used in the modal).
 * - `open`: hold the lid open (driven by hovering the Delete button).
 *
 * `transformBox: 'fill-box'` makes `transform-origin` relative to each group's
 * own bounding box, so "right center" hinges the lid reliably inside the SVG.
 */
export default function AnimatedTrashIcon({ animate = false, open = false, className = '' }) {
    const hinge = { transformBox: 'fill-box', transformOrigin: 'right center' };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {/* Lid: outer group reacts to hover, inner group plays the entrance keyframe */}
            <g
                style={hinge}
                className={`transition-transform duration-300 ease-out-strong ${
                    open ? '-rotate-[28deg]' : 'rotate-0'
                }`}
            >
                <g style={hinge} className={animate ? 'animate-trash-lid' : ''}>
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </g>
            </g>

            {/* Can body + ribs */}
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
        </svg>
    );
}

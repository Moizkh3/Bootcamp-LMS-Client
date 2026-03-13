import React from 'react';

/**
 * Toggle — polished, accessible switch component.
 * Props:
 *   checked  {boolean}   — current on/off state
 *   onChange {function}  — called with new boolean value
 *   label    {string}    — optional accessible label
 *   size     {'sm'|'md'} — defaults to 'md'
 */
export default function Toggle({ checked, onChange, label, size = 'md' }) {
    const isSmall = size === 'sm';

    // Track size
    const trackW = isSmall ? 28 : 44;
    const trackH = isSmall ? 16 : 24;

    // Knob size (2px inset each side)
    const knobSize = trackH - 4;

    // Knob travel distance
    const travel = trackW - trackH;

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            style={{ width: trackW, height: trackH }}
            className={`
                relative inline-flex shrink-0 cursor-pointer rounded-full p-0
                transition-colors duration-200 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
                ${checked ? 'bg-[var(--color-primary)]' : 'bg-slate-300 hover:bg-slate-400'}
            `}
        >
            {/* Knob */}
            <span
                style={{
                    width: knobSize,
                    height: knobSize,
                    top: 2,
                    left: checked ? travel : 2,
                    transition: 'left 0.18s ease-in-out',
                    boxShadow: checked
                        ? '0 1px 4px rgba(17,17,212,0.3)'
                        : '0 1px 3px rgba(0,0,0,0.18)',
                }}
                className="absolute bg-white rounded-full"
            />
        </button>
    );
}

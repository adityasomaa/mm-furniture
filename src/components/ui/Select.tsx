'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type Option = { value: string; label: string };

/**
 * Custom listbox. No native <select> anywhere on this site.
 *
 * A native select cannot be styled: the popup is drawn by the OS, so on Windows it
 * renders as a grey system menu with square corners in the middle of a rounded, warm
 * page. That is the whole reason this exists.
 *
 * The cost of leaving the native control behind is that its keyboard and screen-reader
 * behaviour has to be rebuilt by hand, so this implements the ARIA listbox pattern
 * properly rather than pretending a styled <div> is a form control:
 *   - button carries role=combobox with aria-expanded / aria-controls / aria-activedescendant
 *   - Up/Down/Home/End move the active option, Enter/Space commit, Escape cancels
 *   - typing jumps to the first option starting with that letter
 *   - a hidden native input carries the value so the surrounding <form> still works
 */
export function Select({
  label,
  options,
  value,
  onChange,
  name,
  placeholder = 'Select',
  required,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef('');
  const typedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Keep the active option in view when arrowing past the visible window.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const commit = (i: number) => {
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
        setActive(Math.max(0, options.findIndex((o) => o.value === value)));
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(active);
        break;
      default:
        // Type-ahead, the one native-select affordance people miss most.
        if (e.key.length === 1) {
          typed.current += e.key.toLowerCase();
          clearTimeout(typedTimer.current);
          typedTimer.current = setTimeout(() => (typed.current = ''), 600);
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current));
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={`${id}-btn`} className="tag mb-2 block text-clay">
        {label}
      </label>

      {/* Real form value, so this still submits and still validates. */}
      <input type="hidden" name={name} value={value} required={required} />

      <button
        id={`${id}-btn`}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => {
          setOpen((v) => !v);
          setActive(Math.max(0, options.findIndex((o) => o.value === value)));
        }}
        onKeyDown={onKeyDown}
        className={[
          'flex w-full items-center justify-between gap-3 rounded-md border bg-paper px-4 py-3.5 text-left text-[0.95rem] transition-colors duration-200',
          open ? 'border-brand' : 'border-linen hover:border-clay/50',
          selected ? 'text-bark' : 'text-clay/70',
        ].join(' ')}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          width="10"
          height="7"
          viewBox="0 0 9 6"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-clay transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <ul
        id={`${id}-list`}
        ref={listRef}
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        className={[
          'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-60 origin-top overflow-y-auto rounded-md p-1.5',
          'glass shadow-[0_20px_50px_-20px_rgba(44,26,21,0.5)] transition-all duration-200 ease-quart',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0',
        ].join(' ')}
      >
        {options.map((o, i) => {
          const isSel = o.value === value;
          return (
            <li key={o.value} id={`${id}-opt-${i}`} data-idx={i} role="option" aria-selected={isSel}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => commit(i)}
                onPointerEnter={() => setActive(i)}
                className={[
                  'flex w-full items-center justify-between rounded-sm px-3.5 py-2.5 text-left text-sm transition-colors duration-150',
                  i === active ? 'bg-linen/70 text-brand' : 'text-bark',
                ].join(' ')}
              >
                {o.label}
                {isSel && (
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                    <path d="M1 5l3.6 3.5L12 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

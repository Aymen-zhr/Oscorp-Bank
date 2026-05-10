import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search, X } from 'lucide-react';

export default function AutocompleteInput({
    value,
    onChange,
    options,
    placeholder,
    icon: Icon,
    label,
    id,
    error,
    onFocus,
    onBlur,
}) {
    const [inputValue, setInputValue] = useState(value || '');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Split results into "starts with" (top) and "contains" (rest)
    const { topResults, moreResults } = useMemo(() => {
        if (!inputValue.trim()) {
            return { topResults: options.slice(0, 8), moreResults: [] };
        }
        const q = inputValue.toLowerCase().trim();
        const starts = options.filter((o) => o.toLowerCase().startsWith(q));
        const contains = options.filter(
            (o) =>
                o.toLowerCase().includes(q) && !o.toLowerCase().startsWith(q),
        );
        return {
            topResults: starts.slice(0, 6),
            moreResults: contains.slice(0, 5),
        };
    }, [inputValue, options]);

    const allFiltered = useMemo(
        () => [...topResults, ...moreResults],
        [topResults, moreResults],
    );

    useEffect(() => setInputValue(value || ''), [value]);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const el = listRef.current.querySelector(
                `[data-idx="${highlightedIndex}"]`,
            );
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    const handleSelect = useCallback(
        (option) => {
            setInputValue(option);
            onChange(option);
            setIsOpen(false);
            setHighlightedIndex(-1);
        },
        [onChange],
    );

    const handleClear = () => {
        setInputValue('');
        onChange('');
        inputRef.current?.focus();
        setIsOpen(true);
    };

    const handleFocus = () => {
        onFocus?.();
        setIsOpen(true);
    };

    const handleBlur = (e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
            onBlur?.();
            setTimeout(() => {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }, 120);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            setIsOpen(true);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((p) => Math.min(p + 1, allFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((p) => Math.max(p - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && allFiltered[highlightedIndex]) {
                handleSelect(allFiltered[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    };

    const highlightMatch = (option) => {
        if (!inputValue.trim()) return <span>{option}</span>;
        const q = inputValue.trim();
        const idx = option.toLowerCase().indexOf(q.toLowerCase());
        if (idx === -1) return <span>{option}</span>;
        return (
            <span>
                {option.slice(0, idx)}
                <span className="font-semibold text-[var(--color-gold)]">
                    {option.slice(idx, idx + q.length)}
                </span>
                {option.slice(idx + q.length)}
            </span>
        );
    };

    const isSelected = value && allFiltered.includes(value);
    const showDropdown = isOpen && allFiltered.length > 0;

    const renderItem = (option, globalIndex) => {
        const isHighlighted = globalIndex === highlightedIndex;
        const isCurrentValue = option === value;
        return (
            <motion.li
                key={option}
                data-idx={globalIndex}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(globalIndex * 0.02, 0.1) }}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(globalIndex)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-all select-none ${
                    isHighlighted
                        ? 'bg-[var(--color-gold)]/10 text-[var(--color-text-main)]'
                        : 'text-[var(--color-text-main)]/80 hover:bg-white/[0.04]'
                }`}
            >
                <span className="truncate">{highlightMatch(option)}</span>
                {isCurrentValue && (
                    <Check className="ml-2 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                )}
                {isHighlighted && !isCurrentValue && (
                    <span className="ml-2 flex-shrink-0 font-mono text-[10px] text-[var(--color-gold)]/60">
                        ↵
                    </span>
                )}
            </motion.li>
        );
    };

    return (
        <div ref={wrapperRef} className="relative">
            {/* Icon */}
            {Icon && (
                <div
                    className={`pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 transition-colors ${
                        isSelected
                            ? 'text-emerald-400'
                            : isOpen
                              ? 'text-[var(--color-gold)]'
                              : 'text-[var(--color-text-muted)]/40'
                    }`}
                >
                    <Icon className="h-3.5 w-3.5" />
                </div>
            )}

            {/* Input */}
            <input
                id={id}
                ref={inputRef}
                type="text"
                value={inputValue}
                className={`w-full rounded-xl border bg-[var(--color-bg-base)] px-3.5 py-2.5 pr-8 pl-9 text-sm text-[var(--color-text-main)] transition-all outline-none placeholder:text-[var(--color-text-muted)]/30 ${
                    error
                        ? 'border-red-500/40'
                        : isSelected
                          ? 'border-emerald-500/40'
                          : isOpen
                            ? 'border-[var(--color-gold)]/60'
                            : 'border-[var(--color-border)]/50'
                }`}
                placeholder={placeholder}
                autoComplete="off"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />

            {/* Clear / Check button */}
            <AnimatePresence mode="wait">
                {inputValue ? (
                    <motion.button
                        key="clear"
                        type="button"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.12 }}
                        onClick={handleClear}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[var(--color-text-muted)]/40 transition-colors hover:text-[var(--color-text-muted)]"
                    >
                        {isSelected ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                            <X className="h-3 w-3" />
                        )}
                    </motion.button>
                ) : null}
            </AnimatePresence>

            {/* Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute z-[60] mt-1.5 w-full overflow-hidden rounded-xl border border-[var(--color-border)]/50 shadow-2xl"
                        style={{
                            background: 'rgba(14,14,14,0.97)',
                            backdropFilter: 'blur(32px)',
                        }}
                    >
                        <ul
                            ref={listRef}
                            className="custom-scrollbar-sm max-h-56 overflow-y-auto p-1.5"
                        >
                            {/* "Top matches" label when typing */}
                            {inputValue && topResults.length > 0 && (
                                <li className="flex items-center gap-1.5 px-2.5 pt-1.5 pb-1 text-[9px] font-semibold tracking-widest text-[var(--color-text-muted)]/40 uppercase">
                                    <Search className="h-2.5 w-2.5" />
                                    Best match
                                </li>
                            )}
                            {/* "Suggestions" label when empty */}
                            {!inputValue && (
                                <li className="flex items-center gap-1.5 px-2.5 pt-1.5 pb-1 text-[9px] font-semibold tracking-widest text-[var(--color-text-muted)]/40 uppercase">
                                    <Search className="h-2.5 w-2.5" />
                                    Suggestions
                                </li>
                            )}

                            {topResults.map((opt, i) => renderItem(opt, i))}

                            {/* Divider + "More results" */}
                            {moreResults.length > 0 && (
                                <>
                                    <li className="mx-2 my-1 border-t border-[var(--color-border)]/20" />
                                    <li className="px-2.5 pb-0.5 text-[9px] font-semibold tracking-widest text-[var(--color-text-muted)]/30 uppercase">
                                        Also contains
                                    </li>
                                    {moreResults.map((opt, i) =>
                                        renderItem(opt, topResults.length + i),
                                    )}
                                </>
                            )}
                        </ul>

                        {/* Total count */}
                        {inputValue &&
                            topResults.length + moreResults.length > 0 && (
                                <div className="border-t border-[var(--color-border)]/20 px-3 py-1.5 text-right text-[10px] text-[var(--color-text-muted)]/30">
                                    {topResults.length + moreResults.length}{' '}
                                    result
                                    {topResults.length + moreResults.length !==
                                    1
                                        ? 's'
                                        : ''}
                                </div>
                            )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar-sm::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar-sm::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-sm::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
            `}</style>
        </div>
    );
}

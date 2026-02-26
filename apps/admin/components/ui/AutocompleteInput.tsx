'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AutocompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
}

export function AutocompleteInput({ value, onChange, suggestions, className = '', ...props }: AutocompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value
    const filteredSuggestions = suggestions.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
    );

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className={`w-full pr-10 ${className}`}
                    autoComplete="off"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {isOpen && filteredSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-base">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onChange(suggestion);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2.5 cursor-pointer hover:bg-amber-50 hover:text-amber-700 text-gray-700 transition-colors"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && value && filteredSuggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-500 italic">
                    No matching schools found. Type to add a new one.
                </div>
            )}
        </div>
    );
}

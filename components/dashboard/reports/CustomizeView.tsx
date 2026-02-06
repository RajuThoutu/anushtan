'use client';

import { Settings, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CustomizeViewProps {
    sections: {
        id: string;
        label: string;
        checked: boolean;
    }[];
    onToggle: (id: string) => void;
}

export function CustomizeView({ sections, onToggle }: CustomizeViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-admin-border rounded-lg text-admin-text hover:bg-gray-50 transition shadow-sm"
            >
                <Settings size={18} />
                <span>Customize View</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-admin-border z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-admin-border bg-gray-50">
                        <h4 className="font-semibold text-admin-text text-sm">Dashboard Sections</h4>
                        <p className="text-xs text-gray-500">Select what you want to see</p>
                    </div>
                    <div className="p-2 space-y-1">
                        {sections.map((section) => (
                            <label
                                key={section.id}
                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${section.checked
                                        ? 'bg-admin-emerald border-admin-emerald text-white'
                                        : 'border-gray-300 bg-white'
                                    }`}>
                                    {section.checked && <Check size={12} strokeWidth={3} />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={section.checked}
                                    onChange={() => onToggle(section.id)}
                                    className="hidden"
                                />
                                <span className="text-sm text-admin-text font-medium">{section.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';

type Tab = 'today' | 'mywork';

interface InquiryTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    todayCount: number;
    myWorkCount: number;
}

export function InquiryTabs({ activeTab, onTabChange, todayCount, myWorkCount }: InquiryTabsProps) {
    const tabs = [
        { id: 'today' as Tab, label: "Today's Inquiries", count: todayCount, gradient: 'from-admin-coral to-admin-coral-light' },
        { id: 'mywork' as Tab, label: 'My Work', count: myWorkCount, gradient: 'from-admin-purple to-admin-purple-light' },
    ];

    return (
        <div className="flex border-b border-admin-border bg-gradient-to-r from-white to-admin-bg rounded-t-xl shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-6 py-4 font-medium transition-all relative group
                        ${activeTab === tab.id
                            ? 'text-admin-blue'
                            : 'text-admin-text-secondary hover:text-admin-text'
                        }
                    `}
                >
                    <span className="relative z-10">{tab.label}</span>
                    <span className={`
                        relative z-10 px-2.5 py-1 text-xs font-bold rounded-full transition-all
                        ${activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }
                    `}>
                        {tab.count}
                    </span>
                    {activeTab === tab.id && (
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} rounded-t-full`} />
                    )}
                </button>
            ))}
        </div>
    );
}

export type { Tab };

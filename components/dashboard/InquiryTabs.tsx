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
        { id: 'today' as Tab, label: "Today's Inquiries", count: todayCount },
        { id: 'mywork' as Tab, label: 'My Work', count: myWorkCount },
    ];

    return (
        <div className="flex border-b border-anushtan-border bg-white rounded-t-xl">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-6 py-4 font-medium transition-all relative
                        ${activeTab === tab.id
                            ? 'text-anushtan-terracotta'
                            : 'text-anushtan-charcoal/60 hover:text-anushtan-charcoal'
                        }
                    `}
                >
                    <span>{tab.label}</span>
                    <span className={`
                        px-2 py-0.5 text-xs rounded-full
                        ${activeTab === tab.id
                            ? 'bg-anushtan-terracotta text-white'
                            : 'bg-anushtan-parchment text-anushtan-charcoal/60'
                        }
                    `}>
                        {tab.count}
                    </span>
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-anushtan-terracotta" />
                    )}
                </button>
            ))}
        </div>
    );
}

export type { Tab };

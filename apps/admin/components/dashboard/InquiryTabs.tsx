'use client';

type Tab = 'today' | 'mywork' | 'all';

interface InquiryTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    todayCount: number;
    myWorkCount: number;
    allCount: number;
}

export function InquiryTabs({ activeTab, onTabChange, todayCount, myWorkCount, allCount }: InquiryTabsProps) {
    const tabs = [
        {
            id: 'today' as Tab,
            label: "Today's Inquiries",
            mobileLabel: 'Today',
            count: todayCount,
            gradient: 'from-admin-coral to-admin-coral-light',
        },
        {
            id: 'mywork' as Tab,
            label: 'My Work',
            mobileLabel: 'Mine',
            count: myWorkCount,
            gradient: 'from-admin-purple to-admin-purple-light',
        },
        {
            id: 'all' as Tab,
            label: 'All Inquiries',
            mobileLabel: 'All',
            count: allCount,
            gradient: 'from-admin-blue to-admin-blue-light',
        },
    ];

    return (
        <div className="flex border-b border-admin-border bg-white shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-6 py-3.5 font-medium transition-all relative
                        ${activeTab === tab.id
                            ? 'text-admin-blue'
                            : 'text-gray-400 hover:text-gray-600'
                        }
                    `}
                >
                    {/* Mobile short label / Desktop full label */}
                    <span className="relative z-10 text-xs sm:text-sm font-semibold sm:hidden">{tab.mobileLabel}</span>
                    <span className="relative z-10 text-sm font-semibold hidden sm:inline">{tab.label}</span>

                    {/* Count badge */}
                    <span className={`
                        relative z-10 min-w-[20px] h-5 px-1.5 text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center transition-all
                        ${activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.gradient} text-white shadow-sm`
                            : 'bg-gray-100 text-gray-500'
                        }
                    `}>
                        {tab.count}
                    </span>

                    {/* Active underline */}
                    {activeTab === tab.id && (
                        <div className={`absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r ${tab.gradient} rounded-t-full`} />
                    )}
                </button>
            ))}
        </div>
    );
}

export type { Tab };

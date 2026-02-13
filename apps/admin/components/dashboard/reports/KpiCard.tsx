import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export function KpiCard({ title, value, subtext, icon: Icon, trend, trendValue, color }: KpiCardProps) {
    const colorStyles = {
        blue: {
            bg: 'bg-admin-blue/10',
            text: 'text-admin-blue',
            border: 'border-admin-blue/20',
        },
        purple: {
            bg: 'bg-admin-purple/10',
            text: 'text-admin-purple',
            border: 'border-admin-purple/20',
        },
        emerald: {
            bg: 'bg-admin-emerald/10',
            text: 'text-admin-emerald',
            border: 'border-admin-emerald/20',
        },
        amber: {
            bg: 'bg-admin-amber/10',
            text: 'text-admin-amber',
            border: 'border-admin-amber/20',
        },
        rose: {
            bg: 'bg-admin-rose/10',
            text: 'text-admin-rose',
            border: 'border-admin-rose/20',
        }
    };

    const styles = colorStyles[color];

    return (
        <div className="bg-white rounded-xl border border-admin-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-admin-text-secondary mb-1">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-bold text-admin-text">{value}</span>
                        {trend && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' :
                                    trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${styles.bg} ${styles.text}`}>
                    <Icon size={24} />
                </div>
            </div>
            {subtext && (
                <p className="text-xs text-admin-text-secondary border-t border-admin-border pt-3 mt-2">
                    {subtext}
                </p>
            )}
        </div>
    );
}

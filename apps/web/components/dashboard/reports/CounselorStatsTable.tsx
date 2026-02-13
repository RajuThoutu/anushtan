'use client';

interface CounselorStat {
    name: string;
    total: number;
    statuses: {
        New: number;
        Open: number;
        FollowUp: number;
        Converted: number;
        Closed: number;
    };
    conversionRate: number;
}

interface CounselorStatsTableProps {
    data: CounselorStat[];
}

export function CounselorStatsTable({ data }: CounselorStatsTableProps) {
    // Sort by conversion rate descending
    const sortedData = [...data].sort((a, b) => b.conversionRate - a.conversionRate);

    return (
        <div className="bg-white rounded-xl border border-admin-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-admin-border">
                <h3 className="text-lg font-semibold text-admin-text">Counselor Performance</h3>
                <p className="text-sm text-admin-text-secondary">Aggregate metrics per counselor</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-admin-bg/50 border-b border-admin-border">
                            <th className="px-6 py-4 font-semibold text-admin-text text-sm">Counselor</th>
                            <th className="px-6 py-4 font-semibold text-admin-text text-sm w-24 text-center">Total</th>
                            <th className="px-6 py-4 font-semibold text-admin-text text-sm">Status Distribution</th>
                            <th className="px-6 py-4 font-semibold text-admin-text text-sm text-right">Conversion Success</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {sortedData.map((counselor, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-admin-text">
                                    {counselor.name}
                                </td>
                                <td className="px-6 py-4 text-center text-admin-text font-bold">
                                    {counselor.total}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex h-3 rounded-full overflow-hidden w-full max-w-[200px] bg-gray-100">
                                        {/* New - Blue */}
                                        <div style={{ width: `${(counselor.statuses.New / counselor.total) * 100}%` }} className="bg-blue-400" title={`New: ${counselor.statuses.New}`} />
                                        {/* Open - Yellow */}
                                        <div style={{ width: `${(counselor.statuses.Open / counselor.total) * 100}%` }} className="bg-yellow-400" title={`Open: ${counselor.statuses.Open}`} />
                                        {/* FollowUp - Orange */}
                                        <div style={{ width: `${(counselor.statuses.FollowUp / counselor.total) * 100}%` }} className="bg-orange-400" title={`Follow-up: ${counselor.statuses.FollowUp}`} />
                                        {/* Converted - Green */}
                                        <div style={{ width: `${(counselor.statuses.Converted / counselor.total) * 100}%` }} className="bg-emerald-500" title={`Converted: ${counselor.statuses.Converted}`} />
                                        {/* Closed - Gray */}
                                        <div style={{ width: `${(counselor.statuses.Closed / counselor.total) * 100}%` }} className="bg-gray-400" title={`Closed: ${counselor.statuses.Closed}`} />
                                    </div>
                                    <div className="flex text-[10px] text-gray-500 gap-2 mt-1">
                                        {counselor.statuses.Converted > 0 && <span className="text-emerald-600 font-medium">{counselor.statuses.Converted} Conv</span>}
                                        {counselor.statuses.FollowUp > 0 && <span className="text-orange-600">{counselor.statuses.FollowUp} F/Up</span>}
                                        {counselor.statuses.Open > 0 && <span className="text-yellow-600">{counselor.statuses.Open} Open</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${counselor.conversionRate >= 20 ? 'bg-emerald-100 text-emerald-800' :
                                        counselor.conversionRate >= 10 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {counselor.conversionRate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No counselor data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

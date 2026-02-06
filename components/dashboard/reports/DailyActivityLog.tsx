'use client';

interface DailyLog {
    date: string;
    counselorName: string;
    total: number;
    statusBreakdown: string; // e.g., "2 New, 1 Converted"
}

interface DailyActivityLogProps {
    data: DailyLog[];
}

export function DailyActivityLog({ data }: DailyActivityLogProps) {
    return (
        <div className="bg-white rounded-xl border border-admin-border shadow-sm overflow-hidden h-[400px] flex flex-col">
            <div className="p-6 border-b border-admin-border">
                <h3 className="text-lg font-semibold text-admin-text">Daily Activity Log</h3>
                <p className="text-sm text-admin-text-secondary">Inquiries handled per day by counselor</p>
            </div>

            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10 shadow-sm">
                        <tr className="bg-admin-bg/50 border-b border-admin-border">
                            <th className="px-6 py-3 font-semibold text-admin-text text-sm">Date</th>
                            <th className="px-6 py-3 font-semibold text-admin-text text-sm">Counselor</th>
                            <th className="px-6 py-3 font-semibold text-admin-text text-sm text-center">Total Inquiries</th>
                            <th className="px-6 py-3 font-semibold text-admin-text text-sm">Activity Breakdown</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {data.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 text-sm text-gray-600 font-medium">
                                    {new Date(log.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3 text-sm text-admin-text font-medium">
                                    {log.counselorName}
                                </td>
                                <td className="px-6 py-3 text-center text-sm font-bold text-admin-text">
                                    {log.total}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-600">
                                    {log.statusBreakdown}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No activity data recorded.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import { getServerSession } from "next-auth"
<parameter name="redirect } from " next /navigation"
import { authOptions } from "@/lib/auth/auth-config"

export default async function ReportsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    // Only Admin, HR, and Super Admin can access reports
    const allowedRoles = ['super_admin', 'admin', 'hr']
    if (!allowedRoles.includes(session.user.role)) {
        redirect('/auth/dashboard')
    }

    return (
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                            Reports & Analytics
                        </h1>
                        <p className="text-sm text-anushtan-charcoal/60">
                            View inquiry statistics and trends
                        </p>
                    </div>
                    <a
                        href="/auth/dashboard"
                        className="text-sm text-anushtan-terracotta hover:underline"
                    >
                        ← Back to Dashboard
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-anushtan-border p-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-2">
                            Reports Coming Soon
                        </h2>
                        <p className="text-anushtan-charcoal/60 mb-6">
                            This page will show analytics, trends, and insights from student inquiries.
                        </p>
                        <p className="text-sm text-anushtan-charcoal/50 mb-6">
                            Available after Google Sheets integration is complete.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-anushtan-terracotta">--</div>
                                <div className="text-sm text-anushtan-charcoal/60">Total Inquiries</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-anushtan-terracotta">--</div>
                                <div className="text-sm text-anushtan-charcoal/60">This Month</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-anushtan-terracotta">--</div>
                                <div className="text-sm text-anushtan-charcoal/60">Conversion Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

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
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-admin-purple to-admin-rose bg-clip-text text-transparent mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-admin-text-secondary">
                        View inquiry statistics, trends, and insights
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-admin-border p-12 shadow-sm">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">📊</div>
                        <h2 className="font-heading text-2xl font-bold text-admin-text mb-3">
                            Advanced Analytics Coming Soon
                        </h2>
                        <p className="text-admin-text-secondary mb-6 max-w-md mx-auto">
                            This page will show comprehensive analytics, trends, and insights from student inquiries.
                        </p>
                        <p className="text-sm text-admin-text-secondary/70 mb-8">
                            Dashboard provides basic metrics for now.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                            <div className="p-6 bg-gradient-to-br from-admin-blue/10 to-admin-blue/5 border border-admin-blue/20 rounded-2xl">
                                <div className="text-3xl font-bold bg-gradient-to-r from-admin-blue to-admin-blue-dark bg-clip-text text-transparent">--</div>
                                <div className="text-sm text-admin-text-secondary mt-2">Total Inquiries</div>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-admin-emerald/10 to-admin-emerald/5 border border-admin-emerald/20 rounded-2xl">
                                <div className="text-3xl font-bold bg-gradient-to-r from-admin-emerald to-admin-emerald-dark bg-clip-text text-transparent">--</div>
                                <div className="text-sm text-admin-text-secondary mt-2">This Month</div>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-admin-purple/10 to-admin-purple/5 border border-admin-purple/20 rounded-2xl">
                                <div className="text-3xl font-bold bg-gradient-to-r from-admin-purple to-admin-purple-dark bg-clip-text text-transparent">--</div>
                                <div className="text-sm text-admin-text-secondary mt-2">Conversion Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

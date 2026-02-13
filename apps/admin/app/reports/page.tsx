import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import ReportsClient from './ReportsClient'

export default async function ReportsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    // Only Admin, HR, and Super Admin can access reports
    const allowedRoles = ['super_admin', 'admin', 'hr']
    if (!allowedRoles.includes(session.user.role)) {
        redirect('/dashboard')
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
                <ReportsClient />
            </div>
        </DashboardLayout>
    )
}


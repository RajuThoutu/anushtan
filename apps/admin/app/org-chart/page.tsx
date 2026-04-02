import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import Image from "next/image"

export default async function OrgChartPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    const allowedRoles = ['super_admin', 'admin', 'hr']
    if (!allowedRoles.includes(session.user.role)) {
        redirect('/dashboard')
    }

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-admin-blue to-admin-purple bg-clip-text text-transparent mb-1">
                        Organisation Chart
                    </h1>
                    <p className="text-admin-text-secondary text-sm">
                        Anushtan school hierarchy and reporting structure
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-auto">
                    <Image
                        src="/org-chart.svg"
                        alt="Anushtan Organisation Chart"
                        width={1000}
                        height={1000}
                        className="max-w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

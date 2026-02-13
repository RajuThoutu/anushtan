import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import AllInquiriesClient from './AllInquiriesClient'

export default async function StudentsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-admin-blue to-admin-purple bg-clip-text text-transparent mb-2">
                        All Student Inquiries
                    </h1>
                    <p className="text-admin-text-secondary">
                        Search and manage all student inquiries
                    </p>
                </div>

                {/* Main Content */}
                <AllInquiriesClient />
            </div>
        </DashboardLayout>
    )
}


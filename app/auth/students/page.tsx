import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

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
                <div className="bg-white rounded-2xl border border-admin-border p-12 shadow-sm">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className="font-heading text-2xl font-bold text-admin-text mb-3">
                            Advanced Search Coming Soon
                        </h2>
                        <p className="text-admin-text-secondary mb-6 max-w-md mx-auto">
                            This page will show all student inquiries with powerful search and filter options.
                        </p>
                        <p className="text-sm text-admin-text-secondary/70 mb-8">
                            For now, use the Dashboard to view and manage inquiries.
                        </p>
                        <a
                            href="/auth/students/add"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-admin-blue to-admin-purple text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <span className="text-xl">➕</span>
                            Add New Inquiry
                        </a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

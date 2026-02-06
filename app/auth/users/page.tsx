import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default async function UsersPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    // Only Super Admin can access
    if (session.user.role !== 'super_admin') {
        redirect('/auth/dashboard')
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-admin-amber to-admin-coral bg-clip-text text-transparent mb-2">
                        User Management
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage staff accounts and permissions
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-admin-border p-12 shadow-sm">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">👥</div>
                        <h2 className="font-heading text-2xl font-bold text-admin-text mb-3">
                            User Management Interface Coming Soon
                        </h2>
                        <p className="text-admin-text-secondary mb-6 max-w-md mx-auto">
                            This page will allow you to add, edit, and manage user accounts with role-based permissions.
                        </p>
                        <p className="text-sm text-admin-text-secondary/70 mb-4">
                            For now, users are managed in the code file:
                        </p>
                        <code className="inline-block bg-gradient-to-r from-admin-bg to-gray-100 px-4 py-2 rounded-lg text-sm text-admin-text border border-admin-border">
                            lib/auth/users.ts
                        </code>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

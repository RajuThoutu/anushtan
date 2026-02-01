import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"

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
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                            User Management
                        </h1>
                        <p className="text-sm text-anushtan-charcoal/60">
                            Manage staff accounts and permissions
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
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-2">
                            User Management Coming Soon
                        </h2>
                        <p className="text-anushtan-charcoal/60 mb-6">
                            This page will allow you to add, edit, and manage user accounts.
                        </p>
                        <p className="text-sm text-anushtan-charcoal/50">
                            For now, users are managed in the code file: <code className="bg-gray-100 px-2 py-1 rounded">lib/auth/users.ts</code>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

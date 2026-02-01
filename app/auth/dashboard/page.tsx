import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"

export default async function AuthDashboard() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    const { user } = session

    return (
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                            Anushtan School Portal
                        </h1>
                        <p className="text-sm text-anushtan-charcoal/60">
                            Welcome, {user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm px-3 py-1 bg-anushtan-gold/20 text-anushtan-charcoal rounded-full">
                            {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                        <a
                            href="/api/auth/signout"
                            className="text-sm text-anushtan-terracotta hover:underline"
                        >
                            Sign Out
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-anushtan-border p-8">
                    <h2 className="font-heading text-3xl font-bold text-anushtan-charcoal mb-6">
                        Dashboard
                    </h2>

                    {/* Role-based content */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Student Management - All roles */}
                        <DashboardCard
                            title="Add Student Inquiry"
                            description="Capture new lead information"
                            href="/auth/students/add"
                            icon="➕"
                        />

                        <DashboardCard
                            title="View All Inquiries"
                            description="Search and manage student inquiries"
                            href="/auth/students"
                            icon="📋"
                        />

                        {/* User Management - Super Admin only */}
                        {user.role === 'super_admin' && (
                            <DashboardCard
                                title="User Management"
                                description="Manage staff accounts"
                                href="/auth/users"
                                icon="👥"
                            />
                        )}

                        {/* Reports - Admin and above */}
                        {(user.role === 'super_admin' || user.role === 'admin' || user.role === 'hr') && (
                            <DashboardCard
                                title="Reports"
                                description="View analytics and reports"
                                href="/auth/reports"
                                icon="📊"
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

function DashboardCard({ title, description, href, icon }: {
    title: string
    description: string
    href: string
    icon: string
}) {
    return (
        <a
            href={href}
            className="block p-6 bg-anushtan-parchment border border-anushtan-border rounded-xl hover:shadow-lg hover:border-anushtan-terracotta/30 transition-all group"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="font-heading text-xl font-bold text-anushtan-terracotta mb-2 group-hover:text-anushtan-terracotta/80">
                {title}
            </h3>
            <p className="text-sm text-anushtan-charcoal/70">
                {description}
            </p>
        </a>
    )
}

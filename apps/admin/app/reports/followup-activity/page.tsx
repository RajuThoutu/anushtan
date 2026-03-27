import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FollowUpActivityClient } from './FollowUpActivityClient';

export default async function FollowUpActivityReportPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth');

    const allowedRoles = ['super_admin', 'admin', 'hr'];
    if (!allowedRoles.includes(session.user.role)) redirect('/dashboard');

    return (
        <DashboardLayout>
            <FollowUpActivityClient />
        </DashboardLayout>
    );
}

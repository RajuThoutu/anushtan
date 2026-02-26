import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FollowUpsClient } from './FollowUpsClient';

export default async function FollowUpsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/');

    return (
        <DashboardLayout>
            <FollowUpsClient />
        </DashboardLayout>
    );
}

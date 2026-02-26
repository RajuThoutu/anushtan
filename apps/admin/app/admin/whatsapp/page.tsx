import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WhatsAppManagement } from './WhatsAppManagement';

export const metadata = { title: 'WhatsApp Management — Anushtan Admin' };

export default async function WhatsAppPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/');
    if (session.user?.role !== 'super_admin') redirect('/dashboard');

    return (
        <DashboardLayout>
            <WhatsAppManagement />
        </DashboardLayout>
    );
}

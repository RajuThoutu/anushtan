import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { QrDisplay } from './QrDisplay';

const QR_TARGET_URL = process.env.NEXT_PUBLIC_WEB_URL
    ? `${process.env.NEXT_PUBLIC_WEB_URL}/apply`
    : 'https://anushtansiddipet.in/apply';

export default async function QrPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/');

    return (
        <DashboardLayout>
            <div className="p-8 max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-admin-purple to-admin-rose bg-clip-text text-transparent mb-2">
                        Admission QR Code
                    </h1>
                    <p className="text-admin-text-secondary">
                        Display this QR code at campus events, notice boards, or reception.
                        Parents scan it to instantly fill an inquiry form on their mobile.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-admin-border shadow-sm p-8 flex flex-col items-center">
                    <QrDisplay url={QR_TARGET_URL} />
                </div>
            </div>
        </DashboardLayout>
    );
}

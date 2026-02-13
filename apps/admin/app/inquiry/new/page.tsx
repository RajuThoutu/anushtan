import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { PaperFormUpload } from './PaperFormUpload';

export default async function NewInquiryPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth');
    }

    // Check if user is a counselor
    const isCounselor = ['career_councillor', 'hr', 'admin', 'super_admin'].includes(session.user.role);

    if (!isCounselor) {
        redirect('/auth/dashboard');
    }

    return <PaperFormUpload userName={session.user.name} />;
}

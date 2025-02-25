import { redirect } from 'next/navigation';
import Link from 'next/link';
import { WaitingListForm } from '@/components/waiting-list/waiting-list-form';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export default async function WaitingPage() {
  await connectDB();
  const settings = await Settings.findOne();

  if (!settings?.isWaitingListMode) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="flex-grow flex items-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter">
            Coming Soon
          </h1>
          <p className="text-muted-foreground text-lg">
            We&apos;re working hard to bring you something amazing. Join our waiting list to be the first to know when we launch.
          </p>
          <div className="mt-8">
            <WaitingListForm />
          </div>
        </div>
      </div>
      <footer className="w-full text-center py-4">
        <Link 
          href="/login" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin Login
        </Link>
      </footer>
    </div>
  );
} 
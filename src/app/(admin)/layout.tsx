import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminHeader } from '@/components/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="pl-72">
        <AdminHeader />
        <main className="w-full pt-16 bg-surface min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}


import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopBar } from "@/components/dashboard/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <TopBar />
      <main className="ml-64 p-8 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/app/Sidebar";
import { TopBar } from "@/components/app/TopBar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </div>
  );
}

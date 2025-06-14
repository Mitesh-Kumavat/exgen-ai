import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';

const DashboardLayout = ({ children }: {
    children: React.ReactNode;
}) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                    <header className="border-b border-border p-4 bg-card">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                            <div className="flex-1">
                                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 p-6 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}


export default DashboardLayout;
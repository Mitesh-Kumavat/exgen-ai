
import { PencilIcon, FolderIcon, MailIcon, UsersIcon, LogOutIcon, Home } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useContext } from 'react';
import { AdminAuthContext } from '@/context/AdminContext';

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Manage Students",
        url: "/dashboard/manage-students",
        icon: UsersIcon,
    },
    {
        title: "Create Exam",
        url: "/dashboard/create-exam",
        icon: PencilIcon,
    },
    {
        title: "Manage Exams",
        url: "/dashboard/manage-exams",
        icon: FolderIcon,
    },
    {
        title: "Manage Queries",
        url: "/dashboard/manage-queries",
        icon: MailIcon,
    },
];

export function AppSidebar() {
    const { admin, logout } = useContext(AdminAuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Sidebar className="border-r border-border">
            <SidebarHeader className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">EX</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">ExGen AI</h2>
                        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        className="w-full justify-start gap-3 px-3 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold text-xs">
                                {admin?.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{admin?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

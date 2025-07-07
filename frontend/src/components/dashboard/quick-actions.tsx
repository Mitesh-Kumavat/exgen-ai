import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Users, PencilIcon, FolderIcon, MailIcon } from "lucide-react"
import { Link } from "react-router-dom"

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        description: "Overview & statistics",
    },
    {
        title: "Manage Students",
        url: "/dashboard/manage-students",
        icon: Users,
        description: "Add & manage students",
    },
    {
        title: "Create Exam",
        url: "/dashboard/create-exam",
        icon: PencilIcon,
        description: "Create new exam",
    },
    {
        title: "Manage Exams",
        url: "/dashboard/manage-exams",
        icon: FolderIcon,
        description: "View & edit exams",
    },
    {
        title: "Manage Queries",
        url: "/dashboard/manage-queries",
        icon: MailIcon,
        description: "Handle student queries",
    },
]

export function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {menuItems.map((item, index) => (
                        <Link key={index} to={item.url}>
                            <Button
                                variant="outline"
                                className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
                            >
                                <item.icon className="h-5 w-5" />
                                <div className="text-center">
                                    <div className="font-medium text-sm">{item.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1 hidden sm:block">{item.description}</div>
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

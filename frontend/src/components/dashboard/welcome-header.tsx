import { useContext } from "react"
import { AdminAuthContext } from "@/context/admin-context"

export function WelcomeHeader() {
    const { admin } = useContext(AdminAuthContext)
    const name = admin?.name?.trim() || "Admin"

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                    Welcome, <span className="font-bold">{name}</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                    Here’s what’s happening today.
                </p>
            </div>
        </div>
    )
}

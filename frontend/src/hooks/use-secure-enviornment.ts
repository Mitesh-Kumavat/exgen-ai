import { useEffect } from "react"
import { toast } from "sonner"

export const useSecureExamEnvironment = () => {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()
        document.addEventListener("contextmenu", handleContextMenu)

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()

            if (
                e.ctrlKey && ["c", "v", "x"].includes(key) ||
                e.metaKey && ["c", "v"].includes(key) ||
                key === "f12" ||
                (e.ctrlKey && e.shiftKey && ["i", "j"].includes(key))
            ) {
                e.preventDefault()
            }
        }
        document.addEventListener("keydown", handleKeyDown)

        const handleVisibilityChange = () => {
            if (document.visibilityState !== "visible") {
                toast.warning("Tab switching is not allowed!")
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange)

        const handleWindowBlur = () => {
            toast.warning("Focus lost! Please do not switch tabs.")
        }
        window.addEventListener("blur", handleWindowBlur)

        const requestFullscreen = () => {
            const elem = document.documentElement
            if (elem.requestFullscreen) elem.requestFullscreen()
            else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen()
        }
        requestFullscreen()

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                toast.error("Please stay in fullscreen during the exam.")
                requestFullscreen()
            }
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange)

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("blur", handleWindowBlur)
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])
}

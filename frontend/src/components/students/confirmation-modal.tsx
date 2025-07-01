"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title: string
    description: string
    confirmText: string
    variant?: "default" | "destructive"
}

export const ConfirmationModal = ({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText,
    variant = "default",
}: ConfirmationModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${variant === "destructive" ? "text-destructive" : "text-primary"}`} />
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto cursor-pointer">
                        Cancel
                    </Button>
                    <Button
                        variant={variant}
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

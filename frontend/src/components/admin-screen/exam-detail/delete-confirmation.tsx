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

interface DeleteConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    examTitle: string
}

export const DeleteConfirmationModal = ({ open, onOpenChange, onConfirm, examTitle }: DeleteConfirmationModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="">
                    <div className="flex items-center gap-2 ">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <DialogTitle>Delete Exam</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Are you sure you want to delete <strong>"{examTitle}"</strong>? This action cannot be undone and will
                        permanently remove the exam and all associated data.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto cursor-pointer">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        Delete Exam
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

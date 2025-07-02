import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Send } from "lucide-react"

interface SubmitModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    attempted: number
    total: number
    submitting: boolean
}

export const SubmitModal = ({ open, onOpenChange, onConfirm, attempted, total, submitting }: SubmitModalProps) => {
    const isComplete = attempted === total
    const unanswered = total - attempted

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {isComplete ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                        )}
                        <DialogTitle>Submit Exam</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <DialogDescription>
                        {isComplete
                            ? "You have answered all questions. Are you sure you want to submit your exam?"
                            : "You haven't answered all questions yet. Are you sure you want to submit?"}
                    </DialogDescription>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Questions Attempted:</span>
                            <Badge variant={isComplete ? "default" : "secondary"}>
                                {attempted}/{total}
                            </Badge>
                        </div>

                        {!isComplete && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-amber-600">Unanswered:</span>
                                <Badge variant="outline" className="text-amber-600 border-amber-600">
                                    {unanswered}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {!isComplete && (
                        <div className="text-sm text-muted-foreground bg-amber-50 p-3 rounded border border-amber-200">
                            <strong>Note:</strong> Once submitted, you cannot make any changes to your answers.
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="w-full sm:w-auto"
                    >
                        Review Answers
                    </Button>
                    <Button onClick={onConfirm} disabled={submitting} className="w-full sm:w-auto gap-2">
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Submit Exam
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

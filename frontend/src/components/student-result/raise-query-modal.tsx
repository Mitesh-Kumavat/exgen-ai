"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { raiseQuery } from "@/service/query-service"
import { toast } from "sonner"
import { AlertTriangle, MessageSquareIcon as MessageSquareQuestion, Shield } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"

interface RaiseQueryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    examId: string
    studentId: string
}

export const RaiseQueryModal = ({ open, onOpenChange, examId, studentId }: RaiseQueryModalProps) => {
    const [agreed, setAgreed] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!agreed) {
            toast.error("Please acknowledge the terms before proceeding")
            return
        }

        try {
            setSubmitting(true)
            const response = await raiseQuery({
                examId,
                studentId,
            })

            if (response.data.success) {
                toast.success("Query raised successfully! We will review your request.")
                onOpenChange(false)
                setAgreed(false)
            } else {
                toast.error("Failed to raise query. Please try again.")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to raise query")
            toast.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        onOpenChange(false)
        setAgreed(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <MessageSquareQuestion className="h-5 w-5 text-primary" />
                        <DialogTitle>Raise a Query</DialogTitle>
                    </div>
                    <DialogDescription>
                        Submit a query regarding your exam evaluation. Please read the terms carefully before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-400">
                            <strong>Important Notice:</strong> This feature is for legitimate concerns about AI paper checking only.
                            Misuse may result in disciplinary action.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Terms & Conditions
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg border border-border">
                            <p>• Queries should only be raised for genuine concerns about answer evaluation</p>
                            <p>• False or frivolous queries may result in penalties</p>
                            <p>• Your query will be reviewed by academic staff within 3-5 business days</p>
                            <p>• You will be notified of the outcome via email</p>
                            <p>• Repeated misuse of this feature may lead to disciplinary action</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={checked => setAgreed(checked === true)}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I acknowledge and agree to the terms and conditions
                        </label>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={submitting}
                        className="w-full sm:w-auto bg-transparent"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!agreed || submitting} className="w-full sm:w-auto gap-2">
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <MessageSquareQuestion className="h-4 w-4" />
                                Raise Query
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, MessageSquareIcon as MessageSquareQuestion } from "lucide-react"
import type { Query, MarkUpdate } from "@/types/query"

interface ResolveQueryFormProps {
    query: Query
    markUpdates: MarkUpdate[]
    onResolve: (hasMarksUpdated: boolean) => void
    resolving: boolean
}

export const ResolveQueryForm = ({ query, markUpdates, onResolve, resolving }: ResolveQueryFormProps) => {
    const hasMarksUpdated = markUpdates.length > 0

    const resolveMessage = hasMarksUpdated
        ? "We have reviewed your query and updated your marks accordingly. The changes have been reflected in your result."
        : "We have carefully reviewed your query and your answer was fairly evaluated according to the marking scheme. The marks awarded are appropriate for your response."

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquareQuestion className="h-5 w-5" />
                    Resolve Query
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mark Updates Summary */}
                {hasMarksUpdated ? (
                    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-400">
                            <strong>Marks Updated:</strong> You have made {markUpdates.length} mark update(s). These changes will be
                            applied when the query is resolved.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-400">
                            <strong>No Changes:</strong> The current marks are appropriate and no updates are needed.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Mark Updates List */}
                {hasMarksUpdated && (
                    <div>
                        <h4 className="font-semibold mb-3">Mark Updates Summary:</h4>
                        <div className="space-y-2">
                            {markUpdates.map((update, index) => (
                                <div
                                    key={update.questionId}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded border"
                                >
                                    <span className="text-sm">
                                        {update.questionType.charAt(0).toUpperCase() + update.questionType.slice(1)} Question {index + 1}
                                    </span>
                                    <Badge variant="outline" className="font-semibold">
                                        Updated to {update.newMarks} marks
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resolution Message Preview */}
                <div>
                    <h4 className="font-semibold mb-3">Resolution Message:</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm leading-relaxed">{resolveMessage}</p>
                    </div>
                </div>

                {/* Warning */}
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-400">
                        <strong>Important:</strong> Once resolved, this action cannot be undone. The student will be notified via
                        email about the resolution.
                    </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={() => onResolve(hasMarksUpdated)}
                        disabled={resolving || query.isResolved}
                        className="flex-1 gap-2"
                    >
                        {resolving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Resolving Query...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                {hasMarksUpdated ? "Update Marks & Resolve" : "Resolve Query"}
                            </>
                        )}
                    </Button>
                </div>

                {query.isResolved && (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-400">
                            <strong>Query Resolved:</strong> This query has already been resolved.
                            {query.remarks && (
                                <div className="mt-2 text-sm">
                                    <strong>Resolution:</strong> {query.remarks}
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

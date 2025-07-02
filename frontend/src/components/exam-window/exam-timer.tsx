import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertTriangle } from "lucide-react"
import { getTimerState, saveTimerState } from "@/utils/exam-storage"

interface ExamTimerProps {
    durationMinutes: number
    onTimeUp: () => void
    examId: string
}

export const ExamTimer = ({ durationMinutes, onTimeUp, examId }: ExamTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60) // Convert to seconds
    const [isWarning, setIsWarning] = useState(false)

    useEffect(() => {
        const savedState = getTimerState(examId)
        if (savedState) {
            const elapsed = Math.floor((Date.now() - savedState.startTime) / 1000)
            const remaining = Math.max(0, durationMinutes * 60 - elapsed)
            setTimeLeft(remaining)
        } else {
            saveTimerState(examId, {
                startTime: Date.now(),
                durationMinutes,
            })
        }
    }, [examId, durationMinutes])

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp()
            return
        }

        setIsWarning(timeLeft <= 300)

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1
                if (newTime <= 0) {
                    clearInterval(timer)
                    onTimeUp()
                    return 0
                }
                return newTime
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, onTimeUp])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        }
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <Card className={`${isWarning ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5 p-2 rounded-lg"}`}>
            <CardContent className="px-3">
                <div className="flex items-center gap-2">
                    {isWarning ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                        <Clock className="h-4 w-4 text-primary" />
                    )}
                    <span className={`font-mono text-sm font-semibold ${isWarning ? "text-destructive" : "text-primary"}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-xs text-muted-foreground">remaining</span>
                </div>
            </CardContent>
        </Card>
    )
}

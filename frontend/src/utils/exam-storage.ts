import type { ExamProgress, TimerState } from "@/types"

const EXAM_PROGRESS_PREFIX = "exam_progress_"
const TIMER_STATE_PREFIX = "timer_state_"

export const saveExamProgress = (examId: string, progress: ExamProgress): void => {
    try {
        localStorage.setItem(`${EXAM_PROGRESS_PREFIX}${examId}`, JSON.stringify(progress))
    } catch (error) {
        console.error("Failed to save exam progress:", error)
    }
}

export const getExamProgress = (examId: string): ExamProgress | null => {
    try {
        const saved = localStorage.getItem(`${EXAM_PROGRESS_PREFIX}${examId}`)
        return saved ? JSON.parse(saved) : null
    } catch (error) {
        console.error("Failed to load exam progress:", error)
        return null
    }
}

export const clearExamProgress = (examId: string): void => {
    try {
        localStorage.removeItem(`${EXAM_PROGRESS_PREFIX}${examId}`)
        localStorage.removeItem(`${TIMER_STATE_PREFIX}${examId}`)
    } catch (error) {
        console.error("Failed to clear exam progress:", error)
    }
}

export const saveTimerState = (examId: string, timerState: TimerState): void => {
    try {
        localStorage.setItem(`${TIMER_STATE_PREFIX}${examId}`, JSON.stringify(timerState))
    } catch (error) {
        console.error("Failed to save timer state:", error)
    }
}

export const getTimerState = (examId: string): TimerState | null => {
    try {
        const saved = localStorage.getItem(`${TIMER_STATE_PREFIX}${examId}`)
        return saved ? JSON.parse(saved) : null
    } catch (error) {
        console.error("Failed to load timer state:", error)
        return null
    }
}

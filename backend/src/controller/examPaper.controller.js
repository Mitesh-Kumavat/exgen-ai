import { ExamPaperModel } from "../models/examPaper.model.js";
import { ExamModel as Exam } from "../models/exam.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getExamPapers = async (req, res) => {
    const { examId } = req.params;
    if (!examId) {
        throw new ApiError(400, 'Exam ID is required');
    }

    const examPapers = await ExamPaper.find({ exam: examId }).populate('student', 'name email').populate('exam', 'title subject semester');

    if (!examPapers || examPapers.length === 0) {
        throw new ApiError(404, 'No exam papers found for this exam');
    }

    return res.status(200).json(new ApiResponse(200, examPapers, 'Exam papers retrieved successfully'));
}

export const getExamPaperByStudentId = asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { studentId } = req._id;

    if (!examId || !studentId) {
        throw new ApiError(400, 'Exam ID and Student ID are required');
    }

    const examPaper = await ExamPaperModel.findOne({ exam: examId, student: studentId })
        .populate('student', 'name email')
        .populate('exam', 'title subject semester')
        .populate('questionPaperSchema', 'mcq subjective code evaluationInstruction difficultyInstruction');

    if (!examPaper) {
        throw new ApiError(404, 'Exam paper not found for this student');
    }

    return res.status(200).json(new ApiResponse(200, examPaper, 'Exam paper retrieved successfully'));
})

export const startExam = asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const studentId = req._id;

    if (!examId || !studentId) {
        throw new ApiError(400, 'Exam ID and Student ID are required');
    }

    const exam = await Exam.findById(examId)
        .populate('questionSchema', 'mcq subjective code evaluationInstruction difficultyInstruction')
        .select('-__v -createdAt -updatedAt -createdBy')

    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }

    if (exam.status !== 'active') {
        throw new ApiError(400, 'Exam is not active yet. Please wait for the exam to start.');
    } else if (exam.status === 'completed') {
        throw new ApiError(400, 'Exam has already been completed');
    }

    if (exam.examDate < new Date()) {
        throw new ApiError(400, 'Exam date has already passed');
    }

    const existingExamPaper = await ExamPaperModel.findOne({ exam: examId, student: studentId });

    if (existingExamPaper) {
        throw new ApiError(400, 'Exam paper already exists for this student');
    }

    const payload = {
        questionPaperSchema: exam.questionSchema,
        syllabus: exam.syllabusData,
        marks: exam.totalMarks,
        duration: exam.durationMinutes,
        subject: exam.subject,
    }

    // TODO: Send request to AI service to generate the exam paper and return the generated paper with the certain structure of the exam paper
    // For now, we will return the payload as is 

    return res.status(200).json(payload)
})


import { ExamPaperModel } from "../models/examPaper.model.js";
import { ExamModel as Exam } from "../models/exam.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AI_SERVER_URL } from "../constants.js";

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
        if (existingExamPaper.isSubmitted) {
            throw new ApiError(400, 'You have already submitted this exam paper');
        }

        const sanitizedPaper = {
            _id: existingExamPaper._id,
            student: existingExamPaper.student,
            exam: existingExamPaper.exam,
            questions: {
                mcq: existingExamPaper.questions.mcq.map(({ text, options, marks, _id }) => ({ text, options, marks, _id })),
                subjective: existingExamPaper.questions.subjective,
                code: existingExamPaper.questions.code,
            },
            isSubmitted: existingExamPaper.isSubmitted,
            submitTime: existingExamPaper.submitTime,
            createdAt: existingExamPaper.createdAt,
            updatedAt: existingExamPaper.updatedAt,
        };

        return res.status(200).json(new ApiResponse(200, sanitizedPaper, 'Exam paper already started', { examPaperId: existingExamPaper._id }));
    }

    const payload = {
        questionPaperSchema: exam.questionSchema,
        syllabus: exam.syllabusData,
        marks: exam.totalMarks,
        duration: exam.durationMinutes,
        subject: exam.subject,
    }

    const response = await fetch(`${AI_SERVER_URL}/generate-paper`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(response.status, response.statusText, data);

        throw new ApiError(500, 'Failed to generate exam paper from AI server');
    }

    const questions = data.examPaper;

    if (!questions || questions.length === 0) {
        throw new ApiError(500, 'No questions generated for the exam paper');
    }

    const examPaper = new ExamPaperModel({
        student: studentId,
        exam: examId,
        questionPaperSchema: exam.questionSchema,
        questions: {
            mcq: questions.mcq_questions || [],
            subjective: questions.subjective_questions || [],
            code: questions.coding_questions || []
        }
    });

    await examPaper.save();

    const sanitizedExamPaper = {
        _id: examPaper._id,
        student: examPaper.student,
        exam: examPaper.exam,
        questions: {
            mcq: examPaper.questions.mcq.map(({ text, options, marks, _id }) => ({ text, options, marks, _id })),
            subjective: examPaper.questions.subjective,
            code: examPaper.questions.code,
        },
        isSubmitted: examPaper.isSubmitted,
    };

    return res.status(200).json(new ApiResponse(200, sanitizedExamPaper, 'Exam started successfully', { examPaperId: examPaper._id }))
})
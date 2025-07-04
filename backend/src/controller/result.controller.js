import { ResultModel } from '../models/result.model.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { Parser } from 'json2csv';
import ApiError from '../utils/apiError.js'
import { ExamModel } from '../models/exam.model.js';
import { sendEmail } from '../utils/mail.js';
import { mailResultTemplate } from '../templates/resultMail.js';
import { ApiResponse } from '../utils/apiResponse.js'
import { FRONTEND_URL } from '../constants.js';

export const getResults = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json(new ApiError(400, 'Exam ID is required'));
    }

    const results = await ResultModel.find({ exam: examId })
        .populate('student', 'name email enrollmentNumber')
        .populate('exam', 'title date totalMarks passingMarks')
        .select('-__v -scoreBreakdown')

    if (!results || results.length === 0) {
        throw new ApiError(404, 'No results found for the specified exam');
    }

    res.status(200).json(new ApiResponse(200, results, 'Results fetched successfully'));
})

export const getResultById = asyncHandler(async (req, res) => {
    const { resultId } = req.params;

    if (!resultId) {
        return res.status(400).json(new ApiError(400, 'Result ID is required'));
    }

    const result = await ResultModel.findById(resultId)
        .populate('student', 'name email enrollmentNumber')
        .populate('exam', 'title date')
        .select('-__v');

    if (!result) {
        throw new ApiError(404, 'Result not found');
    }

    res.status(200).json(new ApiResponse(200, result, 'Result fetched successfully'));
})

export const convertResultToCSV = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json(new ApiError(400, 'Exam ID is required'));
    }

    const results = await ResultModel.find({ exam: examId })
        .populate('student', 'name email enrollmentNumber branch')
        .select('-__v -scoreBreakdown');

    const exam = await ExamModel.findById(examId).select('title totalMarks passingMarks semester')

    if (!results || results.length === 0) {
        throw new ApiError(404, 'No results found for the specified exam');
    }

    const fields = ['name', 'enrollment', 'branch', 'total', 'obtained', 'category', 'status']

    const opts = { fields };

    const data = results.map(result => ({
        name: result.student.name,
        enrollment: result.student.enrollmentNumber,
        branch: result.student.branch,
        total: exam.totalMarks,
        obtained: result.achievedMarks,
        category: result.category,
        status: result.achievedMarks >= exam.passingMarks ? 'pass' : 'fail'
    }));

    const parser = new Parser(opts);
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${exam.title}_sem_${exam.semester}_results_${examId}.csv`);
    res.send(csv);
})

export const getResultByStudentAndExam = asyncHandler(async (req, res) => {
    const { studentId, examId } = req.params;

    if (!studentId || !examId) {
        return res.status(400).json(new ApiError(400, 'Student ID and Exam ID are required'));
    }

    const result = await ResultModel.findOne({ student: studentId, exam: examId })
        .populate('student', 'name email enrollmentNumber')
        .populate('exam', 'title date totalMarks passingMarks')
        .select('-__v -scoreBreakdown');

    if (!result) {
        throw new ApiError(404, 'Result not found for the specified student and exam');
    }

    res.status(200).json(new ApiResponse(200, result, 'Result fetched successfully'));
})

export const mailResultToStudent = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json(new ApiError(400, 'Exam ID is required'));
    }

    const results = await ResultModel.find({ exam: examId })
        .populate('student', 'name email enrollmentNumber password')
        .populate('exam', 'title date totalMarks passingMarks subject')

    if (!results) {
        throw new ApiError(404, 'Result not found');
    }

    for (const result of results) {
        const html = mailResultTemplate(
            result.student.name,
            result.student.enrollmentNumber,
            result.answerSheet,
            result.exam._id,
            result.exam.title,
            result.exam.totalMarks,
            result.exam.subject,
            result.achievedMarks,
            result.category,
            result.feedbackSummary,
            FRONTEND_URL
        );
        await sendEmail(result.student.email, `${result.exam.title}-${result.exam.subject} exam's result is out now.`, 'Latest Exam Result', html);
    }

    res.status(200).json(new ApiResponse(200, null, 'Results sent to all students successfully'));
})

export const getResultByAnswerSheetId = asyncHandler(async (req, res) => {
    const { answerSheetId } = req.params;

    if (!answerSheetId) {
        return res.status(400).json(new ApiError(400, 'Answer Sheet ID is required'));
    }

    const result = await ResultModel.findOne({ answerSheet: answerSheetId })
        .populate('student', 'name email enrollmentNumber')
        .populate('exam', 'title date totalMarks passingMarks')
        .select('-__v -scoreBreakdown');

    if (!result) {
        throw new ApiError(404, 'Result not found for the specified answer sheet');
    }

    res.status(200).json(new ApiResponse(200, result, 'Result fetched successfully'));
})
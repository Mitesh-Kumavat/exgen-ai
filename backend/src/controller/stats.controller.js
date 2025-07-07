import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import { ExamModel } from '../models/exam.model.js'
import { AnswerSheetModel } from '../models/answerSheet.model.js'
import { ResultModel } from '../models/result.model.js'
import { StudentModel } from '../models/student.model.js'
import { ExamPaperModel } from '../models/examPaper.model.js'
import { QueryModel } from '../models/query.model.js'

export const getBasicStats = asyncHandler(async (_req, res) => {
    const totalExams = await ExamModel.find().countDocuments();
    const answerSheetsCount = await AnswerSheetModel.find().countDocuments();
    const studentsCount = await StudentModel.find().countDocuments();
    const activeExamsCount = await ExamModel.find({ status: "active" }).countDocuments();
    const pendingQueries = await QueryModel.find({ status: "pending" }).countDocuments();
    const totalQueries = await QueryModel.find().countDocuments();

    if (totalExams === null || answerSheetsCount === null || studentsCount === null) {
        throw new ApiError(500, 'Failed to retrieve statistics');
    }

    const stats = {
        totalExams,
        answerSheetsCount,
        studentsCount,
        activeExamsCount,
        pendingQueries,
        totalQueries,
    };

    res.status(200).json(new ApiResponse(200, stats, 'Statistics retrieved successfully'));
});

export const getStatsByExamId = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        throw new ApiError(400, 'Exam ID is required');
    }

    const exam = await ExamModel.findById(examId).populate('questionSchema');
    const enrolledStudents = await ExamPaperModel.find({ exam: examId }).countDocuments();
    const results = await ResultModel.find({ exam: examId });
    const passingMarks = exam.passingMarks;
    const totalMakrsOfExam = exam.totalMarks;
    const durationOfExam = exam.durationMinutes;

    if (!exam) {
        throw new ApiError(404, 'Exam not found');
    }

    const submittedExamPapers = await ExamPaperModel.find({ exam: examId, isSubmitted: true }).countDocuments();
    const passStudents = results.filter(result => result.achievedMarks >= passingMarks).length;
    const failStudents = results.filter(result => result.achievedMarks < passingMarks).length;
    const averageMarks = results.reduce((acc, result) => acc + result.achievedMarks, 0) / results.length || 0;

    const stats = {
        examName: exam.title,
        semester: exam.semester,
        enrolledStudents,
        duration: durationOfExam,
        totalMarks: totalMakrsOfExam,
        passStudents,
        failStudents,
        averageMarks: averageMarks.toFixed(2),
        submittedExamPapers
    }

    res.status(200).json(new ApiResponse(200, stats, 'Statistics for the exam retrieved successfully'));
});
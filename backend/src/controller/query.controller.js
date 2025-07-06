import { QueryModel } from "../models/query.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from '../utils/apiError.js'
import { sendEmail } from "../utils/mail.js";
import { StudentModel } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ExamPaperModel } from "../models/examPaper.model.js";
import { mailQueryResolveTemplate } from "../templates/queryMail.js";

export const getQueries = asyncHandler(async (req, res) => {
    const queries = await QueryModel.find()
        .populate("student", "name email")
        .populate("exam", "title subject")
        .populate("answerSheet", "score")

    if (!queries) {
        return res.status(404).json(new ApiError(404, "No queries found"));
    }

    return res.status(200).json(new ApiResponse(200, queries, "Queries fetched successfully"));
});

export const raiseQuery = asyncHandler(async (req, res) => {
    const { examId, studentId } = req.body;

    if (!examId) {
        return res.status(400).json(new ApiError(400, "Exam ID is required"));
    }

    const student = await StudentModel.findById(studentId);

    if (!student) {
        return res.status(404).json(new ApiError(404, "Student not found"));
    }

    const existingQuery = await QueryModel.findOne({ student: studentId, exam: examId });

    if (existingQuery) {
        throw new ApiError(400, "You have already raised query for this exam");
    }

    const examPaper = await ExamPaperModel.findOne({ exam: examId, student: studentId }).select("-__v -createdAt -updatedAt -questions");

    if (!examPaper) {
        throw new ApiError(404, "Exam paper not found for the given student and exam");
    }

    const query = await QueryModel.create({
        student: studentId,
        exam: examId,
        answerSheet: examPaper.answerSheet,
        examPaper: examPaper._id
    });

    if (!query) {
        return res.status(500).json(new ApiError(500, "Failed to raise query"));
    }

    return res.status(201).json(new ApiResponse(201, query, "Query raised successfully"));
});

export const getQueryById = asyncHandler(async (req, res) => {
    const { queryId } = req.params;

    if (!queryId) {
        return res.status(400).json(new ApiError(400, "Query ID is required"));
    }

    const query = await QueryModel.findById(queryId)
        .populate("student", "name email")
        .populate("exam", "title")
        .populate("answerSheet", "score");

    if (!query) {
        return res.status(404).json(new ApiError(404, "Query not found"));
    }

    return res.status(200).json(new ApiResponse(200, query, "Query fetched successfully"));
});

export const resolveQuery = asyncHandler(async (req, res) => {
    const { queryId } = req.params;
    const { remarks } = req.body;

    if (!queryId) {
        throw new ApiError(400, "Query ID is required");
    }

    const isResolved = await QueryModel.findOne({ _id: queryId, isResolved: true });
    if (isResolved) {
        throw new ApiError(400, "Query is already resolved");
    }

    if (!remarks) {
        throw new ApiError(400, "Remarks are required to resolve the query");
    }

    const query = await QueryModel.findByIdAndUpdate(queryId, {
        isResolved: true,
        remarks
    }, { new: true });

    const student = await StudentModel.findById(query.student);
    const email = student.email;

    sendEmail(email, "Query Status", "Your query has been resolved", mailQueryResolveTemplate(student.name, student.enrollmentNumber, remarks));

    if (!query) {
        throw new ApiError(404, "Query not found");
    }

    return res.status(200).json(new ApiResponse(200, query, "Query resolved successfully"));
});
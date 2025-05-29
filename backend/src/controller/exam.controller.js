import { ExamModel as Exam } from "../models/exam.model.js";
import { QuestionPaperSchemaModel } from "../models/questionPaperSchema.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllExams = asyncHandler(async (req, res) => {
    try {
        const status = req.query.status;

        let exams;
        if (status) {
            exams = await Exam.find({ status }).sort({ createdAt: -1 });
        } else {
            exams = await Exam.find().sort({ createdAt: -1 });
        }

        if (!exams || exams.length === 0) {
            throw new ApiError(404, 'No active exams found');
        }

        const apiResponse = new ApiResponse(200, exams, 'All exams retrieved successfully');
        res.status(200).json(apiResponse);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
})

export const getExamById = asyncHandler(async (req, res) => {
    try {
        const { examId } = req.params;

        if (!examId) {
            throw new ApiError(400, 'Exam ID is required');
        }

        const exam = await Exam.findById(examId)
            .populate('questionSchema', 'chapterWeightage mcq subjective code evaluationInstruction difficultyInstruction')
            .populate('createdBy', 'name email');

        if (!exam) {
            throw new ApiError(404, 'Exam not found');
        }

        const apiResponse = new ApiResponse(200, exam, 'Exam Information retrieved successfully');
        res.status(200).json(apiResponse);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
})

export const createExam = asyncHandler(async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            semester,
            examDate,
            durationMinutes,
            totalMarks,
            passingMarks,
            chapters,
            syllabusPDFs,
            status,
            questionSchema
        } = req.body;

        const newExam = await Exam.create({
            title,
            subject,
            description,
            semester,
            examDate,
            durationMinutes,
            totalMarks,
            passingMarks,
            chapters,
            status,
            createdBy: req._id
        });

        const questionPaper = await QuestionPaperSchemaModel.create({
            exam: newExam._id,
            chapterWeightage: questionSchema.chapterWeightage,
            mcq: questionSchema.mcq,
            subjective: questionSchema.subjective,
            code: questionSchema.code,
            evaluationInstruction: questionSchema.evaluationInstruction,
            difficultyInstruction: questionSchema.difficultyInstruction
        });

        newExam.questionSchema = questionPaper._id;
        await newExam.save();

        return res.status(201).json({
            message: "Exam and Question Schema created successfully",
            exam: newExam,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
})

export const updateStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;
        const { examId } = req.params;

        if (!examId || !status) {
            throw new ApiError(400, 'Exam ID & Status is required');
        }

        const exam = await Exam.findByIdAndUpdate(
            examId,
            { status },
            { new: true }
        );

        if (!exam) {
            throw new ApiError(404, 'Exam not found');
        }

        const apiResponse = new ApiResponse(200, exam, 'Exam status updated successfully');
        res.status(200).json(apiResponse);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});

export const deleteExam = asyncHandler(async (req, res) => {
    try {
        const { examId } = req.params;

        if (!examId) {
            return res.status(400).json(new ApiResponse(400, null, 'Exam ID is required'));
        }

        const exam = await Exam.findByIdAndDelete(examId);

        if (!exam) {
            return res.status(404).json(new ApiResponse(404, null, 'Exam not found'));
        }

        await QuestionPaperSchemaModel.findOneAndDelete({ exam: examId });

        return res.status(200).json(new ApiResponse(200, null, 'Exam deleted successfully'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
})
import { ExamModel as Exam } from "../models/exam.model.js";
import { ExamPaperModel } from "../models/examPaper.model.js";
import { AnswerSheetModel } from "../models/answerSheet.model.js";
import { ResultModel } from "../models/result.model.js";
import { QuestionPaperSchemaModel } from "../models/questionPaperSchema.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { deleteFromCloudinary } from "../utils/Cloudinary.js";
import { QueryModel } from "../models/query.model.js";

export const getAllExams = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const projection = "-__v -updatedAt -questionSchema -syllabusData";

    const exams = await Exam.find(query)
        .sort({ createdAt: -1 })
        .select(projection)
        .lean();

    if (!exams || exams.length === 0) {
        throw new ApiError(404, 'No exams found');
    }

    return res.status(200).json(
        new ApiResponse(200, exams, 'Exams retrieved successfully')
    );
});


export const getExamById = asyncHandler(async (req, res) => {
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
})

export const createExam = asyncHandler(async (req, res) => {
    const {
        title,
        subject,
        description,
        semester,
        examDate,
        durationMinutes,
        totalMarks,
        passingMarks,
        syllabusData,
        questionSchema
    } = req.body;

    if (!title || !subject || !semester || !durationMinutes || !totalMarks || !passingMarks || !questionSchema || !syllabusData) {
        throw new ApiError(400, 'All fields are required except description.');
    }

    for (const syllabus of syllabusData) {
        if (!syllabus.chapter || !syllabus.url || !syllabus.publicId || !syllabus.marks) {
            console.log('syllabusData', syllabus);

            throw new ApiError(400, 'All syllabus fields are required');
        }
    }

    var total = syllabusData.reduce((acc, syllabus) => acc + syllabus.marks, 0);

    if (total !== totalMarks) {
        throw new ApiError(400, `You made ${total} marks of paper which do not match total marks of exam ${totalMarks}`);
    }

    const newExam = await Exam.create({
        title,
        subject,
        description,
        semester,
        examDate,
        durationMinutes,
        totalMarks,
        passingMarks,
        syllabusData,
        createdBy: req._id
    });

    const questionPaper = await QuestionPaperSchemaModel.create({
        exam: newExam._id,
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
})

export const updateStatus = asyncHandler(async (req, res) => {
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
});

// TODO: Delete vectorize data of exam's PDF.
export const deleteExam = asyncHandler(async (req, res) => {
    const { examId } = req.params;

    if (!examId) {
        return res.status(400).json(new ApiResponse(400, null, 'Exam ID is required'));
    }

    const exam = await Exam.findByIdAndDelete(examId);

    const allPDFPath = exam.syllabusData.filter(syllabus => syllabus.url && syllabus.publicId);

    for (const pdf of allPDFPath) {
        if (pdf.publicId) {
            await deleteFromCloudinary(pdf.publicId);
        }
    }

    if (!exam) {
        return res.status(404).json(new ApiResponse(404, null, 'Exam not found'));
    }

    await QuestionPaperSchemaModel.findOneAndDelete({ exam: examId });
    await ExamPaperModel.deleteMany({ exam: examId });
    await QueryModel.deleteMany({ exam: examId });
    await AnswerSheetModel.deleteMany({ exam: examId });
    await ResultModel.deleteMany({ exam: examId });

    return res.status(200).json(new ApiResponse(200, null, 'Exam deleted successfully'));
})

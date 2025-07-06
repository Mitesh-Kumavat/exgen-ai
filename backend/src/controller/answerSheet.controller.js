import { asyncHandler } from '../utils/asyncHandler.js';
import { AnswerSheetModel } from '../models/answerSheet.model.js';
import { ExamPaperModel } from "../models/examPaper.model.js";
import { ExamModel } from '../models/exam.model.js';
import { AI_SERVER_URL } from '../constants.js';
import mongoose from 'mongoose';
import { evaluateMcqAnswers, findCodingQuestions, findSubjectiveQuestions } from "../utils/evaluator.js";
import { ApiResponse } from '../utils/apiResponse.js';
import { ResultModel } from '../models/result.model.js';
import { getCategory } from '../utils/getCategory.js';

export const submitAnswerSheet = asyncHandler(async (req, res) => {
    const submittedAt = new Date();
    const { answers } = req.body;
    const { examId } = req.params;
    const studentId = req._id;

    if (!answers || !examId) {
        return res.status(400).json(new ApiResponse(400, null, "Answers and exam paper ID are required"));
    }

    const examPaper = await ExamPaperModel.findOne({
        exam: examId,
        student: studentId,
    })
        .populate('questionPaperSchema', "evaluationInstruction")
        .populate('exam', 'totalMarks');

    if (!examPaper) return res.status(404).json(new ApiResponse(404, null, "Exam paper not found"));

    if (examPaper.isSubmitted) {
        return res.status(400).json(new ApiResponse(400, null, "Exam paper already submitted"));
    }

    const instructions = examPaper.questionPaperSchema.evaluationInstruction;

    const mcqEvaluated = evaluateMcqAnswers(
        answers.mcq_questions || [],
        examPaper.questions.mcq
    );

    const mcqTotal = mcqEvaluated.reduce((sum, q) => sum + q.marksAwarded, 0);

    const subjectiveAnswers = findSubjectiveQuestions(answers.subjective_questions || [], examPaper.questions.subjective || []);
    const codeAnswers = findCodingQuestions(answers.coding_questions || [], examPaper.questions.code || []);

    const payload = {
        subjective_answers: subjectiveAnswers,
        code_answers: codeAnswers,
        evaluation_instructions: instructions,
    }

    const response = await fetch(`${AI_SERVER_URL}/evaluate-exam`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    }).catch(err => {
        console.error("Error connecting to AI server:", err);
        return res.status(500).json(new ApiResponse(500, null, "Error connecting to AI server"));
    });

    if (!response.ok) {
        return res.status(500).json(new ApiResponse(500, null, "Error evaluating exam paper"));
    }

    const data = await response.json();

    const totalCode = data.evaluationResult.code.reduce((sum, q) => sum + q.marksAwarded, 0);
    const totalSubjective = data.evaluationResult.subjective.reduce((sum, q) => sum + q.marksAwarded, 0);
    const totalMarks = mcqTotal + totalCode + totalSubjective;

    const answerSheet = new AnswerSheetModel({
        student: studentId,
        exam: examId,
        answers: {
            mcq: mcqEvaluated,
            subjective: data.evaluationResult.subjective,
            code: data.evaluationResult.code
        },
        achievedMarks: totalMarks,
        isSubmitted: true,
        submitTime: submittedAt,
    });

    await answerSheet.save();

    await ExamPaperModel.updateOne(
        { _id: examPaper._id },
        { isSubmitted: true, submitTime: submittedAt, answerSheet: answerSheet._id },
    );

    const category = getCategory(totalMarks, examPaper.exam.totalMarks);

    const result = await ResultModel.create({
        student: studentId,
        exam: examId,
        achievedMarks: totalMarks,
        category: category,
        answerSheet: answerSheet._id,
        scoreBreakdown: {
            mcq: mcqTotal,
            subjective: totalSubjective,
            code: totalCode
        },
        feedbackSummary: data?.evaluationResult.other.feedbackSummary || null
    })

    return res.status(200).json(new ApiResponse(200, {
        answerSheet,
    }, "Answer sheet submitted successfully"));
});

export const updateMarks = asyncHandler(async (req, res) => {
    const { answerSheetId } = req.params;
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json(new ApiResponse(400, null, "Updates array is required"));
    }

    const validTypes = ['subjective', 'code'];

    const answerSheet = await AnswerSheetModel.findById(answerSheetId);
    if (!answerSheet) {
        return res.status(404).json(new ApiResponse(404, null, "Answer sheet not found"));
    }

    const updatedQuestions = [];

    for (const update of updates) {
        const { questionType, questionId, newMarks } = update;

        if (!validTypes.includes(questionType) || !mongoose.Types.ObjectId.isValid(questionId)) {
            continue;
        }

        const answersArray = answerSheet.answers[questionType];
        const index = answersArray.findIndex(q => q.questionId.toString() === questionId);

        if (index !== -1) {
            answersArray[index].marksAwarded = newMarks;
            updatedQuestions.push({
                questionType,
                questionId,
                newMarks
            });
        }
    }

    const newMcqTotal = answerSheet.answers.mcq.reduce((sum, q) => sum + (q.marksAwarded || 0), 0);
    const newSubjectiveTotal = answerSheet.answers.subjective.reduce((sum, q) => sum + (q.marksAwarded || 0), 0);
    const newCodeTotal = answerSheet.answers.code.reduce((sum, q) => sum + (q.marksAwarded || 0), 0);
    const newAchievedMarks = newMcqTotal + newSubjectiveTotal + newCodeTotal;

    answerSheet.achievedMarks = newAchievedMarks;
    await answerSheet.save();

    const result = await ResultModel.findOne({ answerSheet: answerSheet._id });
    if (result) {
        result.achievedMarks = newAchievedMarks;
        result.scoreBreakdown = {
            mcq: newMcqTotal,
            subjective: newSubjectiveTotal,
            code: newCodeTotal
        };

        const totalMarks = (await ExamModel.findById(result.exam))?.totalMarks;

        result.category = getCategory(newAchievedMarks, totalMarks);
        await result.save();
    }

    return res.status(200).json(new ApiResponse(200, {
        updatedQuestions,
        newTotalMarks: newAchievedMarks
    }, `Marks updated successfully for ${updatedQuestions.length} question(s).`));
});

export const getAnswerSheetById = asyncHandler(async (req, res) => {
    const { answerSheetId } = req.params;

    const answerSheet = await AnswerSheetModel.findById(answerSheetId)
        .populate('student', 'name email enrollmentNumber')
        .populate('exam', 'title date subject')
        .populate('exam.questionPaperSchema', 'title');

    if (!answerSheet) {
        return res.status(404).json(new ApiResponse(404, null, "Answer sheet not found"));
    }

    return res.status(200).json(new ApiResponse(200, answerSheet, "Answer sheet retrieved successfully"));
});
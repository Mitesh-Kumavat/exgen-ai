import { asyncHandler } from '../utils/asyncHandler.js';
import { AnswerSheetModel } from '../models/answerSheet.model.js';
import { ExamPaperModel } from "../models/examPaper.model.js";
import { AI_SERVER_URL } from '../constants.js';
import { evaluateMcqAnswers, findCodingQuestions, findSubjectiveQuestions } from "../utils/evaluator.js";
import { ApiResponse } from '../utils/apiResponse.js';
import { ResultModel } from '../models/result.model.js';

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
    }).populate('questionPaperSchema', "evaluationInstruction");

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
        { isSubmitted: true, submitTime: submittedAt },
        { answerSheet: answerSheet._id }
    );

    const result = await ResultModel.create({
        student: studentId,
        exam: examId,
        achievedMarks: totalMarks,
        category: data.evaluationResult.other.category,
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

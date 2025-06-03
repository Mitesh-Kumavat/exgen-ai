import { asyncHandler } from '../utils/asyncHandler.js';
import { AnswerSheetModel } from '../models/answerSheet.model.js';
import { ExamPaperModel } from "../models/examPaper.model.js";
import { AI_SERVER_URL } from '../constants.js';
import { evaluateMcqAnswers, findCodingQuestions, findSubjectiveQuestions } from "../utils/evaluator.js";
import { ApiResponse } from '../utils/apiResponse.js';

export const submitAnswerSheet = asyncHandler(async (req, res) => {
    const { answers } = req.body;
    const { examId } = req.params;
    const studentId = req._id;

    if (!answers || !examId) {
        return res.status(400).json(new ApiResponse(400, null, "Answers and exam paper ID are required"));
    }

    const examPaper = await ExamPaperModel.find({
        exam: examId,
        student: studentId,
        isSubmitted: false
    }).populate('questionPaperSchema', "evaluationInstruction");

    if (!examPaper) return res.status(404).json(new ApiResponse(404, null, "Exam paper not found"));

    if (examPaper.isSubmitted) {
        return res.status(400).json(new ApiResponse(400, null, "Exam paper already submitted"));
    }

    const instructions = examPaper[0].questionPaperSchema.evaluationInstruction;

    const mcqEvaluated = evaluateMcqAnswers(
        answers.mcq_questions || [],
        examPaper[0].questions.mcq
    );

    const mcqTotal = mcqEvaluated.reduce((sum, q) => sum + q.marksAwarded, 0);

    const subjectiveAnswers = findSubjectiveQuestions(answers.subjective_questions || [], examPaper[0].questions.subjective || []);
    const codeAnswers = findCodingQuestions(answers.coding_questions || [], examPaper[0].questions.code || []);

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
    })

    if (!response.ok) {
        return res.status(500).json(new ApiResponse(500, null, "Error evaluating exam paper"));
    }

    const data = await response.json();

    return res.status(200).json(new ApiResponse(200, payload, "Answer sheet submitted successfully"));
});

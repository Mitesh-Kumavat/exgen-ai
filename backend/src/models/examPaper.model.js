import mongoose from 'mongoose';

const McqQuestionSchema = new mongoose.Schema({
    question: String,
    options: [{ id: Number, text: String }],
    correctOption: Number,
    marks: Number,
});

const SubjectiveQuestionSchema = new mongoose.Schema({
    question: String,
    marks: Number,
});

const CodeQuestionSchema = new mongoose.Schema({
    question: String,
    language: String,
    marks: Number,
});

const ExamPaper = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    answerSheet: { type: mongoose.Schema.Types.ObjectId, ref: "AnswerSheetSchema" },
    questions: {
        mcq: [McqQuestionSchema],
        subjective: [SubjectiveQuestionSchema],
        code: [CodeQuestionSchema]
    },
    isSubmitted: { type: Boolean, default: false },
    submitTime: Date,
},
    { timestamps: true }
);

export const ExamPaperModel = mongoose.model("ExamPaper", ExamPaper);
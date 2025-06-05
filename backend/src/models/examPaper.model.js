import mongoose from 'mongoose';

const McqQuestionSchema = new mongoose.Schema({
    text: String,
    options: [String],
    correctOption: String,
    marks: Number,
});

const SubjectiveQuestionSchema = new mongoose.Schema({
    text: String,
    marks: Number,
});

const CodeQuestionSchema = new mongoose.Schema({
    text: String,
    marks: Number,
});

const ExamPaper = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    questionPaperSchema: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionPaperSchema", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    answerSheet: { type: mongoose.Schema.Types.ObjectId, ref: "AnswerSheet", default: null },
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
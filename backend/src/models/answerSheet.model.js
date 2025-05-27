import mongoose from 'mongoose';

const AnswerSheetSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
        answers: {
            mcq: [{
                questionId: { type: mongoose.Schema.Types.ObjectId },
                selectedOption: Number,
                isCorrect: Boolean,
                marksAwarded: Number
            }],
            subjective: [{
                questionId: { type: mongoose.Schema.Types.ObjectId },
                answerText: String,
                marksAwarded: Number,
                aiFeedback: String
            }],
            code: [{
                questionId: { type: mongoose.Schema.Types.ObjectId },
                answerText: String,
                marksAwarded: Number,
                testCaseResults: Array,
                aiFeedback: String
            }]
        },
        totalMarks: Number,
        isSubmitted: { type: Boolean, default: false },
        submitTime: Date,
    },
    { timestamps: true }
);

export const AnswerSheetModel = mongoose.model("AnswerSheet", AnswerSheetSchema);
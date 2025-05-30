import mongoose from "mongoose";

const Query = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    },
    answerSheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnswerSheet"
    },
    examPaper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamPaper"
    },
    isResolved: {
        type: boolean,
        default: false
    },
    remarks: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export const QueryModel = mongoose.model("Query", Query);

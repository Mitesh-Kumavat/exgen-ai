import mongoose from 'mongoose';

const Result = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam"
    },
    totalMarks: {
        type: Number,
        min: 0,
        required: true
    },
    category: {
        type: String,
        enum: ['weak', 'average', 'topper']
    },
    scoreBreakdown: {
        mcq: Number,
        subjective: Number,
        code: Number
    },
    feedbackSummary: {
        type: String,
        trim: true,
        default: null
    }
}, { timestamps: true });

export const ResultModel = mongoose.model('Result', Result)
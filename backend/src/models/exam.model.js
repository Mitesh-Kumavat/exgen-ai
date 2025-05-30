import mongoose from 'mongoose';

const Exam = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        semester: {
            type: Number,
            required: true,
        },
        examDate: Date,
        durationMinutes: {
            type: Number,
            required: true,
        },
        totalMarks: {
            type: Number,
            required: true,
        },
        passingMarks: {
            type: Number,
            required: true,
        },
        questionSchema: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuestionPaperSchema"
        },
        chapters: {
            type: [String],
            default: []
        },
        syllabusPDFs: {
            type: [{
                url: {
                    type: String,
                    required: true
                },
                publicId: {
                    type: String,
                    required: true
                }
            }],
            default: []
        },
        status: {
            type: String,
            enum: ['draft', 'active', 'completed'], default: 'draft'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        },
    },
    { timestamps: true }
);

export const ExamModel = mongoose.model('Exam', Exam);
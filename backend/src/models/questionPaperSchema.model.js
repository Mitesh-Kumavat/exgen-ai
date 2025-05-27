import mongoose from 'mongoose';

const QuestionPaperSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            index: true
        },
        chapterWeightage: [
            {
                ch: { type: Number, required: true },
                percentage: { type: Number, required: true, min: 0, max: 100 }
            }
        ],
        mcq: {
            count: {
                type: Number,
                required: true,
                min: 0
            },
            mark: {
                type: Number,
                required: true,
                min: 0
            }
        },
        subjective: {
            count: {
                type: Number,
                required: true,
                min: 0
            },
            mark: {

                type: Number,
                required: true,
                min: 0
            },
            additionalCheckingTip: {
                type: String,
                trim: true
            }
        },
        code: {
            count: {
                type: Number,
                required: true,
                min: 0
            },
            mark: {
                type: Number,
                required: true,
                min: 0
            },
            additionalCheckingTip: {
                type: String,
                trim: true
            }
        },
        evaluationInstruction: {
            type: String,
            trim: true
        },
        difficultyInstruction: {
            type: String,
            trim: true
        },
    },
    { timestamps: true }
);

export const QuestionPaperSchemaModel = mongoose.model('QuestionPaperSchema', QuestionPaperSchema);
import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    enrollmentNumber: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    mobile: {
        type: String,
        unique: true,
    },
    branch: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const StudentModel = mongoose.model('Student', StudentSchema);
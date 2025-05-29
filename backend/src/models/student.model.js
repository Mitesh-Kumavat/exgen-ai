import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
        default: 'exgen@ai'
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


StudentSchema.methods.matchPassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

StudentSchema.methods.generateToken = function () {
    const token = jwt.sign({
        id: this._id,
        enrollmentNumber: this.enrollmentNumber
    },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;
}

StudentSchema.methods.verifyToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export const StudentModel = mongoose.model('Student', StudentSchema);
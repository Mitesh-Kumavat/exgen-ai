import { StudentModel as Student } from '../models/student.model.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js';

export const getAllStudents = asyncHandler(async (req, res) => {
    try {
        const students = await Student.find({}).select('-password -__v');

        if (!students || students.length === 0) {
            return res.status(404).json(new ApiResponse(404, 'No students found', null));
        }

        return res.status(200).json(new ApiResponse(200, students, 'Students retrieved successfully'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});

export const loginStudent = asyncHandler(async (req, res) => {
    try {
        const { enrollmentNumber, password } = req.body;

        if (!enrollmentNumber || !password) {
            return res.status(400).json(new ApiResponse(400, 'Enrollment number and password are required', null));
        }

        const student = await Student.findOne({ enrollmentNumber });

        if (!student || !(await student.matchPassword(password))) {
            return res.status(401).json(new ApiResponse(401, 'Invalid Enrollment number or password', null));
        }

        const token = student.generateToken();

        return res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: true,
                maxAge: 4 * 60 * 60 * 1000 // 4 hours only
            })
            .json(new ApiResponse(200, student, 'Login successful'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});

export const registerStudent = asyncHandler(async (req, res) => {
    try {
        const { name, enrollmentNumber, email, mobile, branch } = req.body;

        if (!name || !enrollmentNumber || !email || !branch) {
            return res.status(400).json(new ApiResponse(400, 'All fields are required', null));
        }

        const existingStudent = await Student.findOne({ enrollmentNumber });

        if (existingStudent) {
            return res.status(409).json(new ApiResponse(409, 'Student already exists', null));
        }

        const student = new Student({
            name,
            enrollmentNumber,
            email,
            mobile,
            branch
        });

        await student.save();

        return res.status(201).json(new ApiResponse(201, student, 'Student registered successfully'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});

export const getStudentProfile = asyncHandler(async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);

        if (!student) {
            return res.status(404).json(new ApiResponse(404, 'Student not found', null));
        }

        return res.status(200).json(new ApiResponse(200, student, 'Student profile retrieved successfully'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});

export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie('token', '', {
            httpOnly: true,
            secure: true,
            expires: new Date(0)
        })
        .json(new ApiResponse(200, null, 'Logout successful'));
});

export const getProfileInfo = asyncHandler(async (req, res) => {
    try {
        console.log(req._id);

        const student = await Student.findById(req._id).select('-password -__v');

        if (!student) {
            return res.status(404).json(new ApiResponse(404, 'Student not found', null));
        }

        return res.status(200).json(new ApiResponse(200, student, 'Profile information retrieved successfully'));
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
    }
});


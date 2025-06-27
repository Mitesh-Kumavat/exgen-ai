import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { StudentModel as Student } from '../models/student.model.js'
import { AdminModel as Admin } from '../models/admin.model.js'
import { createToken } from '../utils/jwtHandler.js'
import csv from 'csvtojson';
import { sendEmail } from '../utils/mail.js'
import { mailPasswordTemplate } from '../templates/passwordMail.js'
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/Cloudinary.js'
import { deleteFile } from '../utils/deleteFile.js'
import { AI_SERVER_URL } from '../constants.js'

export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'All fields are required',);
    }

    const admin = await Admin.findOne({ email })

    if (admin) {
        throw new ApiError(400, 'Admin already exists with this email',);
    }

    const newAdmin = await Admin.create({ name, email, password });

    if (!newAdmin) {
        throw new ApiError(500, 'Failed to create admin',);
    }

    const apiResponse = new ApiResponse(201, {
        name: newAdmin.name,
        email: newAdmin.email
    }, 'Admin created successfully');

    res.status(200).json(apiResponse);
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required',);
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.isPasswordMatched(password))) {
        throw new ApiError(400, 'Invalid email or password',);
    }
    const token = createToken(admin._id);

    const apiResponse = new ApiResponse(200, {
        name: admin.name,
        email: admin.email,
        token: token
    }, 'Admin logged in successfully');

    res
        .status(200)
        .cookie('admin', token, {
            httpOnly: true,
            secure: true,
            maxAge: 48 * 60 * 60 * 1000
        })
        .json(apiResponse);
})

export const getAdmin = asyncHandler(async (req, res) => {
    const admin = req._id;
    if (!admin) {
        throw new ApiError(404, 'Invalid Request',);
    }

    const currentAdmin = await Admin.findById(admin).select('-password');
    if (!currentAdmin) {
        throw new ApiError(404, 'Admin not found',);
    }
    const apiResponse = new ApiResponse(200, currentAdmin, 'Admin retrieved successfully');

    res.status(200).json(apiResponse);
})

export const logout = asyncHandler(async (req, res) => {
    res
        .clearCookie('admin', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .status(200)
        .json(new ApiResponse(200, null, 'Admin logged out successfully'));
})

export const uploadStudentFromCsv = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, 'CSV file is required', null));
    }

    const studentsData = await csv().fromFile(req.file.path);

    if (!studentsData || studentsData.length === 0) {
        return res.status(400).json(new ApiResponse(400, 'No valid data found in CSV file', null));
    }

    const students = await Student.insertMany(studentsData);

    deleteFile(req.file.path);

    return res.status(201).json(new ApiResponse(201, students, 'Students uploaded successfully'));
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json(new ApiResponse(400, 'Student ID is required', null));
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
        return res.status(404).json(new ApiResponse(404, 'Student not found', null));
    }

    return res.status(200).json(new ApiResponse(200, null, 'Student deleted successfully'));
});

export const deleteAllStudents = asyncHandler(async (req, res) => {
    const result = await Student.deleteMany({});

    if (result.deletedCount === 0) {
        return res.status(404).json(new ApiResponse(404, null, 'No students found to delete'));
    }

    return res.status(200).json(new ApiResponse(200, null, `${result.deletedCount} students deleted successfully`));
});

export const generateRandomPasswords = asyncHandler(async (req, res) => {
    const students = await Student.find({});

    if (!students || students.length === 0) {
        return res.status(404).json(new ApiResponse(404, 'No students found', null));
    }

    const updatedStudents = await Promise.all(students.map(async (student) => {
        const randomPassword = Math.random().toString(36).slice(-6);
        student.password = randomPassword;
        await student.save();
        return { enrollmentNumber: student.enrollmentNumber, password: randomPassword };
    }));

    return res.status(200).json(new ApiResponse(200, updatedStudents, 'Random passwords generated successfully'));
});

export const mailPassword = asyncHandler(async (req, res) => {
    const students = await Student.find({});

    if (!students || students.length === 0) {
        return res.status(404).json(new ApiResponse(404, 'No students found', null));
    }

    for (const student of students) {
        const html = mailPasswordTemplate(student.name, student.enrollmentNumber, student.password);
        await sendEmail(student.email, 'Exam Login Credentials', '', html);
    }

    return res.status(200).json(new ApiResponse(200, null, 'Password emails sent successfully'));
});

export const uploadPDF = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, 'PDF file is required'));
    }
    if (req.file.mimetype !== 'application/pdf' && req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json(new ApiResponse(400, null, 'Only PDF files 5 MB are allowed'));
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult) {
        return res.status(500).json(new ApiResponse(500, null, 'Failed to upload PDF',));
    }

    const vectorizeResponse = await fetch(`${AI_SERVER_URL}/vectorize-pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pdf_path: uploadResult.secure_url,
            metadata: {
                chapter: req.body.chapter || '',
                pdf_id: uploadResult.public_id || '',
            }
        }),
    });

    const vectorizeResult = await vectorizeResponse.json();

    const apiResponse = new ApiResponse(200, {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        importantTopics: vectorizeResult.importantTopics,
    }, 'PDF uploaded successfully');

    return res.status(200).json(apiResponse);
})

export const deletePDF = asyncHandler(async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
        return res.status(400).json(new ApiResponse(400, null, 'Public ID is required'));
    }

    const result = await deleteFromCloudinary(publicId);

    if (result.result !== 'ok') {
        return res.status(500).json(new ApiResponse(500, null, 'Failed to delete PDF',));
    }

    return res.status(200).json(new ApiResponse(200, null, 'PDF deleted successfully'));
})
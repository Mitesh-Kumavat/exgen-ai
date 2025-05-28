import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { AdminModel as Admin } from '../models/admin.model.js'
import { createToken } from '../utils/jwtHandler.js'

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
        throw new ApiError(401, 'Invalid email or password',);
    }
    const token = createToken(admin._id);

    const apiResponse = new ApiResponse(200, {
        name: admin.name,
        email: admin.email
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
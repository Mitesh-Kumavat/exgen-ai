import { ApiResponse } from "../utils/apiResponse.js";
import { verifyToken } from "../utils/jwtHandler.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.admin;

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, 'Unauthorized access'));
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return res.status(403).json(new ApiResponse(401, null, 'Unauthorized access'));
        }

        req._id = decoded.data;
        next();
    } catch (error) {
        return res.status(403).json(new ApiResponse(401, null, 'Unauthorized access'));
    }
}

export const verifyStudent = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, 'Unauthorized access'));
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return res.status(403).json(new ApiResponse(401, null, 'Unauthorized access'));
        }

        console.log(decoded.id);

        req._id = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json(new ApiResponse(401, null, 'Unauthorized access'));
    }
}
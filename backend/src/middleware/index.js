import { verifyToken } from "../utils/jwtHandler.js";

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.admin;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = verifyToken(token);
        req._id = decoded.data;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden access' });
    }
}

export const verifyStudent = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = await verifyToken(token);
        req._id = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden access' });
    }
}
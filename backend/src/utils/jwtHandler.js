import jwt from 'jsonwebtoken';

export const createToken = (data) => {
    const token = jwt.sign({ data: data }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}

export const verifyToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (e) {
        return null;
    }
}
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
        console.log("Decoded token:", decoded);

        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}
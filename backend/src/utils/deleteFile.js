import fs from 'fs';

export const deleteFile = (filePath) => {
    try {
        if (!filePath) return null;
        fs.unlinkSync(filePath);
        return true;
    } catch (error) {
        return false;
    }
}
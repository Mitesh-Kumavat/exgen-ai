export const getCategory = (achievedMarks, totalMarks) => {
    if (achievedMarks >= totalMarks * 0.85) {
        return 'excellent';
    } else if (achievedMarks >= totalMarks * 0.65) {
        return 'good';
    } else if (achievedMarks >= totalMarks * 0.50) {
        return 'average';
    } else {
        return 'weak';
    }
}
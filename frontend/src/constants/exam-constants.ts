export const SEMESTERS = Array.from({ length: 10 }, (_, i) => `Semester ${i + 1}`);

export const examFormFields = [
    { key: "title", label: "Title", type: "text" },
    { key: "subject", label: "Subject", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "examDate", label: "Exam Date", type: "datetime-local" },
    { key: "durationMinutes", label: "Duration (Minutes)", type: "number" },
    { key: "totalMarks", label: "Total Marks", type: "number" },
    { key: "passingMarks", label: "Passing Marks", type: "number" },
] as const;

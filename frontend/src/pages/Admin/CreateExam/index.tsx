import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExamInfo } from "./ExamInfo";
import { QuestionSchemaForm } from "./QuestionSchemaForm";
import { ChapterFormList } from "./ChapterFormList";
import { uploadChapterPDF, createExamDraft } from "@/service/examService";
import type { ChapterForm } from "@/types";
import type { QuestionSchema } from "@/types";
import { useNavigate } from "react-router-dom";

const initialForm = {
    title: "",
    subject: "",
    description: "",
    semester: 1,
    examDate: "",
    durationMinutes: 0,
    totalMarks: 0,
    passingMarks: 0,
};

export default function CreateExam() {
    const [formData, setFormData] = useState(initialForm);
    const [chapters, setChapters] = useState<ChapterForm[]>([{ chapter: "", marks: 0, file: null }]);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const [questionSchema, setQuestionSchema] = useState<QuestionSchema>({
        mcq: { count: 0, mark: 1 },
        subjective: { count: 0, mark: 0, additionalCheckingTip: "" },
        code: { count: 0, mark: 0, additionalCheckingTip: "" },
        evaluationInstruction: "",
        difficultyInstruction: "",
    });

    const handleFormChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const uploadPDF = async (index: number) => {
        const { chapter, file } = chapters[index];
        if (!chapter || !file) return toast.error("Chapter name and PDF required");
        if (file.size > 5 * 1024 * 1024) return toast.error("PDF must be under 5MB");

        try {
            setUploadingIndex(index);
            const { data } = await uploadChapterPDF(chapter, file);
            const updated = [...chapters];
            updated[index].uploadData = data.data;
            setChapters(updated);
            toast.success("PDF uploaded");
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploadingIndex(null);
        }
    };

    const createExam = async () => {
        const { title, subject, semester, durationMinutes, totalMarks, passingMarks } = formData;
        if (!title || !subject || !semester || !durationMinutes || !totalMarks || !passingMarks) {
            return toast.error("All required fields must be filled.");
        }

        const syllabusData = chapters.map((ch) => ({ chapter: ch.chapter, marks: ch.marks, ...ch.uploadData }));
        if (syllabusData.some((ch) => !ch.chapter || !ch.url || !ch.marks)) {
            return toast.error("All chapters must have name, marks, and uploaded PDF.");
        }

        const totalChapterMarks = syllabusData.reduce((sum, ch) => sum + ch.marks, 0);
        if (totalChapterMarks !== +formData.totalMarks) {
            return toast.error("Chapter marks must match total exam marks.");
        }

        try {
            setCreating(true);
            await createExamDraft({
                ...formData,
                status: "draft",
                syllabusData,
                questionSchema,
            });
            toast.success("Exam created");
            setFormData(initialForm);
            setQuestionSchema({ mcq: { count: 0, mark: 1 }, subjective: { count: 0, mark: 0, additionalCheckingTip: "" }, code: { count: 0, mark: 0, additionalCheckingTip: "" }, evaluationInstruction: "", difficultyInstruction: "" });
            setChapters([{ chapter: "", marks: 0, file: null }]);
            navigate("/dashboard/manage-exams");
        } catch {
            toast.error("Failed to create exam");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <Card>
                <CardContent className="pt-6">
                    <ExamInfo formData={formData} handleFormChange={handleFormChange} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <QuestionSchemaForm schema={questionSchema} setSchema={setQuestionSchema} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <ChapterFormList chapters={chapters} setChapters={setChapters} uploadingIndex={uploadingIndex} uploadPDF={uploadPDF} />
                </CardContent>
            </Card>

            <div className="flex justify-end"><Button onClick={createExam} disabled={creating}>{creating ? "Creating..." : "Create Exam"}</Button></div>
        </div>
    );
}

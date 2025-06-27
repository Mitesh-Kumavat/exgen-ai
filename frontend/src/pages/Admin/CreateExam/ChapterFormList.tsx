import { Button } from "@/components/ui/button";
import { ChapterCard } from "./ChapterCard";
import type { ChapterForm } from "@/types";

export const ChapterFormList = ({
    chapters,
    setChapters,
    uploadingIndex,
    uploadPDF,
}: {
    chapters: ChapterForm[];
    setChapters: (ch: ChapterForm[]) => void;
    uploadingIndex: number | null;
    uploadPDF: (i: number) => void;
}) => {
    const handleChapterChange = <K extends keyof ChapterForm>(i: number, key: K, value: ChapterForm[K]) => {
        const updated = [...chapters];
        updated[i][key] = value;
        setChapters(updated);
    };

    const removeChapter = (i: number) => {
        const updated = [...chapters];
        updated.splice(i, 1);
        setChapters(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Syllabus Chapters</h2>
                <Button onClick={() => setChapters([...chapters, { chapter: "", marks: 0, file: null }])}>
                    + Add Chapter
                </Button>
            </div>
            {chapters.map((chapter, i) => (
                <ChapterCard
                    key={i}
                    chapter={chapter}
                    index={i}
                    uploading={uploadingIndex === i}
                    onChange={handleChapterChange}
                    onRemove={removeChapter}
                    onUpload={uploadPDF}
                />
            ))}
        </div>
    );
};

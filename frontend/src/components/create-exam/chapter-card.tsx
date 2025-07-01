import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import type { ChapterForm } from "@/types";

export const ChapterCard = ({
    chapter,
    index,
    uploading,
    onChange,
    onRemove,
    onUpload,
}: {
    chapter: ChapterForm;
    index: number;
    uploading: boolean;
    onChange: (index: number, key: keyof ChapterForm, value: any) => void;
    onRemove: (index: number) => void;
    onUpload: (index: number) => void;
}) => (
    <div className="space-y-4 rounded-xl border p-4 bg-muted/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium">Chapter Name</label>
                <Input
                    value={chapter.chapter}
                    onChange={(e) => onChange(index, "chapter", e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Marks</label>
                <Input
                    type="number"
                    value={chapter.marks}
                    onChange={(e) => onChange(index, "marks", +e.target.value)}
                />
            </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <Button variant="destructive" onClick={() => onRemove(index)} className="w-full md:w-auto">
                <X className="w-4 h-4 mr-2" /> Delete Chapter
            </Button>
            <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Upload PDF</label>
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => onChange(index, "file", e.target.files?.[0] || null)}
                    />
                    <Button size="sm" variant="secondary" disabled={uploading} onClick={() => onUpload(index)}>
                        {uploading ? "Uploading..." : <UploadCloud className="w-4 h-4" />}
                    </Button>
                </div>
                {chapter.uploadData?.url && <p className="text-xs text-green-600">PDF Uploaded ✓</p>}
            </div>
        </div>
    </div>
);

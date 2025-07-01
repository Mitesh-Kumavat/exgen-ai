import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEMESTERS, examFormFields } from "@/constants/examConstants";

export const ExamInfo = ({ formData, handleFormChange }: any) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium">Semester</label>
            <Select value={String(formData.semester)} onValueChange={(val) => handleFormChange("semester", +val)}>
                <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                <SelectContent>
                    {SEMESTERS.map((label, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {examFormFields.map(({ key, label, type }) => (
            <div key={key} className="space-y-1">
                <label className="text-sm font-medium">{label}</label>
                <Input
                    type={type}
                    value={formData[key]}
                    onChange={(e) => handleFormChange(key, type === "number" ? +e.target.value : e.target.value)}
                />
            </div>
        ))}
    </div>
);

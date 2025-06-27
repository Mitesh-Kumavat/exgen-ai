import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionSchema } from "@/types";

type Props = {
    schema: QuestionSchema;
    setSchema: (s: QuestionSchema) => void;
};

export const QuestionSchemaForm = ({ schema, setSchema }: Props) => (
    <div className="space-y-6">
        {(["mcq", "subjective", "code"] as const).map((type) => (
            <div key={type} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">{(type).charAt(0).toUpperCase() + type.slice(1, type.length)} Count</label>
                        <Input
                            type="number"
                            value={schema[type].count}
                            onChange={(e) =>
                                setSchema({
                                    ...schema,
                                    [type]: { ...schema[type], count: +e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{(type).charAt(0).toUpperCase() + type.slice(1, type.length)} Marks</label>
                        <Input
                            type="number"
                            value={schema[type].mark}
                            onChange={(e) =>
                                setSchema({
                                    ...schema,
                                    [type]: { ...schema[type], mark: +e.target.value },
                                })
                            }
                        />
                    </div>
                </div>
                {type !== "mcq" && (
                    <div>
                        <label className="block text-sm font-medium">{(type).charAt(0).toUpperCase() + type.slice(1, type.length)} Checking Tip</label>
                        <Textarea
                            value={schema[type].additionalCheckingTip}
                            onChange={(e) =>
                                setSchema({
                                    ...schema,
                                    [type]: { ...schema[type], additionalCheckingTip: e.target.value },
                                })
                            }
                        />
                    </div>
                )}
            </div>
        ))}
        <div>
            <label className="block text-sm font-medium">Evaluation Instruction</label>
            <Textarea
                value={schema.evaluationInstruction}
                placeholder="Provide instructions for evaluating subjective and code questions"
                onChange={(e) => setSchema({ ...schema, evaluationInstruction: e.target.value })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium">Difficulty Instruction</label>
            <Textarea
                placeholder="Maintain 30% easy, 20% medium, 50% hard questions"
                value={schema.difficultyInstruction}
                onChange={(e) => setSchema({ ...schema, difficultyInstruction: e.target.value })}
            />
        </div>
    </div>
);

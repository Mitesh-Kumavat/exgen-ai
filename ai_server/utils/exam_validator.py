from schemas.exam_request_schema import ExamPaperRequest
from typing import Dict, List
from fastapi import HTTPException


def validate_exam_structure(generated_exam: Dict, req: ExamPaperRequest):
    schema = req.questionPaperSchema

    mcqs = generated_exam.get("mcq_questions", [])
    if len(mcqs) != schema.mcq.count:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid MCQ count: expected {schema.mcq.count}, got {len(mcqs)}"
        )

    for i, q in enumerate(mcqs, start=1):
        if q.get("marks") != schema.mcq.mark:
            raise HTTPException(status_code=422, detail=f"MCQ {i} has invalid marks")
        if q.get("correctOption") not in ["A", "B", "C", "D"]:
            raise HTTPException(status_code=422, detail=f"MCQ {i} has invalid correctOption")

    subjectives = generated_exam.get("subjective_questions", [])
    if len(subjectives) != schema.subjective.count:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid Subjective count: expected {schema.subjective.count}, got {len(subjectives)}"
        )

    for i, q in enumerate(subjectives, start=1):
        if q.get("marks") != schema.subjective.mark:
            raise HTTPException(status_code=422, detail=f"Subjective {i} has invalid marks")

    coding = generated_exam.get("coding_questions", [])
    if len(coding) != schema.code.count:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid Coding question count: expected {schema.code.count}, got {len(coding)}"
        )

    for i, q in enumerate(coding, start=1):
        if q.get("marks") != schema.code.mark:
            raise HTTPException(status_code=422, detail=f"Coding {i} has invalid marks")

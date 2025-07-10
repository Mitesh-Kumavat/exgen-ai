from fastapi import APIRouter, HTTPException
from schemas.exam_request_schema import ExamPaperRequest
from schemas.exam_evaluation import ExamEvaluationRequest
from controllers.exam_controller import generate_paper, evaluate_exam

router = APIRouter()

@router.post("/generate-paper")
async def generate_exam(req: ExamPaperRequest):
    return await generate_paper(req)

@router.post("/evaluate-exam")
async def evaluate(req: ExamEvaluationRequest):
    return await evaluate_exam(req)

from fastapi import HTTPException
from schemas.exam_request_schema import ExamPaperRequest
from schemas.exam_evaluation import ExamEvaluationRequest
from llms.paper_generator import generate_exam_paper
from llms.exam_evaluator import evaluate_exam_paper

async def generate_paper(req: ExamPaperRequest):
    try:
        paper = await generate_exam_paper(req)
        return {"message": "Exam paper generated successfully", "examPaper": paper}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def evaluate_exam(req: ExamEvaluationRequest):
    try:
        result = await evaluate_exam_paper(req)
        return {"message": "Exam evaluated successfully", "evaluationResult": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionSchema(BaseModel):
    questionId: str
    answerText: str
    question: str
    marks: int

class ExamEvaluationRequest(BaseModel):
    subjective_answers: Optional[List[QuestionSchema]]
    code_answers: Optional[List[QuestionSchema]]
    evaluation_instructions: Optional[str]
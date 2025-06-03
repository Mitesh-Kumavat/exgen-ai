from pydantic import BaseModel, Field
from typing import Dict, List

class McqSchema(BaseModel):
    count: int
    mark: int

class SubjectiveSchema(BaseModel):
    count: int
    mark: int
    additionalCheckingTip: str
    
class QuestionPaperSchema(BaseModel):
    mcq: McqSchema
    subjective: SubjectiveSchema
    code: SubjectiveSchema
    evaluationInstruction: str
    difficultyInstruction: str

class SyllabusSchema(BaseModel):
    chapter: str
    url: str
    publicId: str
    marks: int
    importantTopics: str

class ExamPaperRequest(BaseModel):
    questionPaperSchema: QuestionPaperSchema
    syllabus: List[SyllabusSchema]
    marks: int
    duration: int
    subject: str

from pydantic import BaseModel, Field

# This will be used to generate an exam paper using langchain for a student.

class ExamPaper(BaseModel):
    student: str = Field(..., description="ID of the student")
    questions: dict = Field(
        default_factory=lambda: {
            "mcq": [McqQuestion],
            "subjective": [SubjectiveQuestion],
            "code": [CodeQuestion]
        },
        description="Questions in the exam paper categorized by type"
    )

class McqQuestion(BaseModel):
    question: str = Field(..., description="The MCQ question text")
    options: list = Field(..., description="List of options for the MCQ")
    correct_option: int = Field(..., description="Index of the correct option")
    marks: int = Field(..., description="Marks assigned to the question")
    
class SubjectiveQuestion(BaseModel):
    question: str = Field(..., description="The subjective question text")
    marks: int = Field(..., description="Marks assigned to the question")
    
class CodeQuestion(BaseModel):
    question: str = Field(..., description="The code question text")
    marks: int = Field(..., description="Marks assigned to the question")
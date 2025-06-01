from pydantic import BaseModel, Field

class AnswerSheet(BaseModel):
    answers: dict = Field(
        default_factory=lambda: {
            "subjective": [Temp],
            "code": [Temp]
        },
        description="Answers provided by the student categorized by question type"
    )

class Temp(BaseModel):
    answerText: str = Field(..., description="The answer text provided by the student")
    marksAwarded: int = Field(..., description="Marks awarded for the answer")
    aiFeedback: str = Field(..., description="AI-generated feedback for the answer")
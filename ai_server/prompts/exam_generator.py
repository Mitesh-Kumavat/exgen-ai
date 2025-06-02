from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.prompts import PromptTemplate

response_schemas = [
    ResponseSchema(
        name="mcq_questions",
        description="List of multiple choice questions. Each question should have text, options, correctOption, and marks. For Ex: {'text': 'Question text', 'options': ['Option A', 'Option B', 'Option C', 'Option D'], 'correctOption': 'A', 'marks': 1}"
    ),
    ResponseSchema(
        name="subjective_questions",
        description="List of subjective questions with their marks. Each question should have text and marks. For Ex: {'text': 'Question text', 'marks': 5}"
    ),
    ResponseSchema(
        name="coding_questions",
        description="List of coding questions with their marks. Each question should have text and marks. For Ex: {'text': 'Question text', 'marks': 8}"
    ),
]

parser = StructuredOutputParser.from_response_schemas(response_schemas)

exam_generator_prompt = PromptTemplate(
    input_variables=[
        "marks", "duration", "subject",
        "mcq_count", "mcq_marks",
        "subjective_count", "subjective_marks",
        "code_count", "code_marks",
        "difficulty_instruction", "context", "ch_wise_marks", "random_seed"
    ],
    partial_variables={"format_instructions": parser.get_format_instructions()},
    template="""
You are an expert exam paper generator. Your task is to create a comprehensive exam paper based on the provided syllabus and requirements.

The exam paper should include:
- Multiple Choice Questions (MCQs): {mcq_count} questions, each worth {mcq_marks} marks.
- Subjective Questions: {subjective_count} questions, each worth {subjective_marks} marks.
- Coding Questions: {code_count} questions, each worth {code_marks} marks.

Total Marks: {marks} , the final exam paper should sum up to the total marks specified.
Duration: {duration} minutes , make sure to make the exam paper suitable for the given duration.
Subject: {subject} 

NOTE: The exam paper should be unique and not copy any existing exam papers. It should be based on the provided syllabus and important topics. we are generating different exam papers for the same syllabus, so make sure to generate unique questions and you can add 2 or 3 more unique questions related to the given syllabus's near kind of syllabus.

{random_seed} for random seed to ensure uniqueness in question generation.

Chapter-wise Mark Distribution:
{ch_wise_marks}

Difficulty Instruction:
{difficulty_instruction}

Here is the context from the syllabus and important topics:
{context}

You must return only a valid JSON object that matches the format described above. Do not add explanations, headers, or any additional text. Just return the JSON.
Output the exam paper in the following structured format (Pure JSON format):
{format_instructions}
"""
)

from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.prompts import PromptTemplate

response_schemas = [
    ResponseSchema(
        name="subjective",
        description="List of subjective questions with their marks awarded and aiFeedback. Each question should have questionId, marksAwarded, answerText aiFeedback. For Ex -> subjective_questions: {'questionId': '1', 'marksAwarded': 5, 'answerText': 'Answer text', 'aiFeedback': 'Feedback text'}"
    ),
    ResponseSchema(
        name="code",
        description="List of coding questions with their marks awarded and aiFeedback. Each question should have questionId, marksAwarded, answerText, aiFeedback. For Ex -> code_questions: {'questionId': '1', 'marksAwarded': 5, 'answerText': 'Answer text', 'aiFeedback': 'Feedback text'}"
    ),
    ResponseSchema(
        name="other",
        description="provide feedbackSummary for the student should be in object named 'other'. It should include overall feedback on the exam performance, strengths, and areas for improvement. The feedback should be constructive and helpful for the student to understand their performance better. For Ex -> feedbackSummary: 'Overall, the student performed well in coding questions but needs improvement in subjective answers.' NOTE: no more than 2 lines. and also provide category from weak, average or topper only. Ex: 'category': 'average' -> (based on the overall performance of the student in the exam paper). The category should be determined based on the marks awarded in subjective and coding questions."
    )
]

parser = StructuredOutputParser.from_response_schemas(response_schemas)

evaluation_prompt = PromptTemplate(
    input_variables=[
        "code_chunks",
        "subjective_chunks",
        "instructions",
        "code_que_and_ans",
        "subjective_que_and_ans",
    ],
    partial_variables={"format_instructions": parser.get_format_instructions()},
    template="""
You are an expert exam paper evaluator. Your task is to evaluate the provided exam paper based on the given instructions and answers.

The exam paper might include:
- Subjective Questions: Each question should be evaluated based on the provided answer and marks.
- Coding Questions: Each question should be evaluated based on the provided answer and marks.

Here are the provided chunks of information/notes related to the exam paper syllabus and notes from which the exam paper is generated:
{code_chunks}
{subjective_chunks}

Here are the additonal evaluation instructions by the instructor: {instructions}

here is the questions and answers for evaluation with the maximum marks for each question(Do not give extra marks or higher marks than the max marks for each question):

- These are code questions and answers:
{code_que_and_ans}
\n\n
- Here are the subjective questions and answers:
{subjective_que_and_ans}

- Evaluate the answers based on the provided chunks and instructions. Give proper feedback and marks for each question.
- Do not hallucinate or make assumptions about the answers. Use only the provided chunks and instructions for evaluation.
- Evaluation should be fair according to the given marks for each question
- Do not give extra marks then the given marks for each question, if the answer is not correct or not up to the mark, give 0 marks for that question. But if the answer is little bit correct, give some marks according to the answer.
- Provide the proper marks, suppose if question is of 5 marks, then give marks between 0 to 5 only. but make sure user has written the answer according to the 5 marks , like length wise, topic wise and all. so be a fair evaluator. if user has only written 1 line answer for a 5 marks question, then give 0 marks or 1 mark only. But if user has written a good answer for a 5 marks question, then give marks between 3 to 5 according to the answer.
- Do not give any marks/less marks for the questions which are not answered by the user. or incomplete answers or incorrect answers or not up to the mark answers or not relevant answers or not sufficient answers.

You must return only a valid JSON object that matches the format described above. Do not add explanations, headers, or any additional text. Just return the JSON.
Output the exam paper in the following structured format (Pure JSON format):
{format_instructions}
"""
)

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from schemas.exam_evaluation import ExamEvaluationRequest
from utils.pdf_vectorizer import search_similar_chunks
from prompts.exam_evaluation import evaluation_prompt
from prompts.exam_evaluation import parser
load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.3,
)

chain = evaluation_prompt | llm | parser

async def evaluate_exam_paper(req:ExamEvaluationRequest):
    instructions = req.evaluation_instructions
    subjective = req.subjective_answers
    code = req.code_answers
    
    code_questions = []
    subjective_questions = []
    
    code_que_and_ans = []
    subjective_que_and_ans = []
    
    if code:
        for question in code:
            code_questions.append(question.question)
            
    if subjective:
        for question in subjective:
            subjective_questions.append(question.question)
            
    code_chunks = ""
    subjective_chunks = ""
    
    for question in code_questions:
        code_chunks += search_similar_chunks(question, k=4)[0].page_content + "\n"
        
    for question in subjective_questions:
        subjective_chunks += search_similar_chunks(question, k=4)[0].page_content + "\n"      
    
    for code in code:
        code_que_and_ans.append({
            "questionId": code.questionId,
            "question": code.question,
            "answer": code.answerText,
            "marks": code.marks
        })
        
    for subjective in subjective:
        subjective_que_and_ans.append({
            "questionId": subjective.questionId,
            "question": subjective.question,
            "answer": subjective.answerText,
            "marks": subjective.marks
        })
    
    output = chain.invoke({
        "code_chunks": code_chunks,
        "subjective_chunks": subjective_chunks,
        "instructions": instructions,
        "code_que_and_ans": code_que_and_ans,
        "subjective_que_and_ans": subjective_que_and_ans,
    })
    
    return output

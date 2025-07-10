from dotenv import load_dotenv
from langchain_groq import ChatGroq
from prompts.exam_generator import exam_generator_prompt
from schemas.exam_request_schema import ExamPaperRequest
from utils.pdf_vectorizer import search_similar_chunks
from utils.exam_validator import validate_exam_structure
from prompts.exam_generator import parser
import random

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.5,
)

chain = exam_generator_prompt | llm | parser

async def generate_exam_paper(req: ExamPaperRequest):
    
    if not req.syllabus or not req.syllabus:
        raise ValueError("Syllabus and chapters must be provided in the request.")
    
    important_topics = []
    
    for chapter in req.syllabus:
        if hasattr(chapter, 'importantTopics') and chapter.importantTopics:
            important_topics.append(chapter.importantTopics)
            
    if not important_topics:
        raise ValueError("No important topics found in the syllabus chapters.")

    chunks = ""
    ch_wise_marks = ""
    for chapter in req.syllabus:
        ch_wise_marks += f"{chapter.chapter}: {chapter.marks}\n"
    
    for topic in important_topics:
        context = search_similar_chunks(query=topic , k = 9)
        if context:
            chunks += "\n".join([doc.page_content for doc in context]) + "\n"
    
    generated_exam = chain.invoke({
        "marks": req.marks,
        "duration": req.duration,
        "subject": req.subject,
        "mcq_count": req.questionPaperSchema.mcq.count,
        "mcq_marks": req.questionPaperSchema.mcq.mark,
        "subjective_count": req.questionPaperSchema.subjective.count,
        "subjective_marks": req.questionPaperSchema.subjective.mark,
        "code_count": req.questionPaperSchema.code.count,
        "code_marks": req.questionPaperSchema.code.mark,
        "difficulty_instruction": req.questionPaperSchema.difficultyInstruction,
        "context": chunks,
        "ch_wise_marks": ch_wise_marks,
        "random_seed": random.randint(0, 10000)  
    })
    
    validate_exam_structure(generated_exam, req)
    
    return generated_exam

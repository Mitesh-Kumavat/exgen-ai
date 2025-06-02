from fastapi import FastAPI, HTTPException
from schemas.requests_schema import ChunkIDRequest, PDFUploadRequest, QueryRequest
from schemas.examp_request_schema import ExamPaperRequest
from llms.paper_generator import generate_exam_paper
from utils.pdf_vectorizer import (
    add_pdf_to_vectorstore,
    get_chunk_by_id,
    delete_chunks_by_ids,
    search_similar_chunks,
    delete_all_chunks,
    get_all_chunks
)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/vectorize-pdf")
async def vectorize_pdf(req: PDFUploadRequest):
    pdf_path = req.pdf_path
    metadata = req.metadata
    try:
        important_topics = add_pdf_to_vectorstore(pdf_path, metadata)
        return {"message": "Vectorization successful", "importantTopics": important_topics}
    except Exception as e:
        print(f"Error during vectorization: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/get-chunk/{chunk_id}")
async def get_chunk(chunk_id: str):
    chunk = get_chunk_by_id(chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    return chunk

@app.delete("/api/v1/delete-chunks")
async def delete_chunks(req: ChunkIDRequest):
    try:
        delete_chunks_by_ids(req.chunk_ids)
        return {"message": "Chunks deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v1/delete-all-chunks")
async def delete_chunks():
    try:
        success = delete_all_chunks()  # Pass None to delete all chunks
        return {"message": "All chunks deleted successfully." if success else "No chunks found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/chunks")
async def get_chunks():
    chunks = get_all_chunks()
    return {
        "chunks": chunks
    }

@app.post("/api/v1/search-chunks")
async def search_chunks(req: QueryRequest):
    try:
        chunks = search_similar_chunks(req.query, k=req.top_k)
        return {"results": [chunk.page_content for chunk in chunks]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/v1/generate-paper')
async def generate_paper(req: ExamPaperRequest):
    try:
        exam_paper = await generate_exam_paper(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e), message="Invalid request data.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e), message="An error occurred while generating the exam paper.")
    
    return {
        "message": "Exam paper generated successfully", 
        "examPaper": exam_paper
    }

# TODO: Implement the following endpoints later
@app.post('/api/v1/evaluate-exam')
async def evaluate_exam_paper():
    return {"message": "Exam paper evaluated successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='localhost', port=8010, log_level="info")

# run command: uvicorn app:app --port 8010 --reload
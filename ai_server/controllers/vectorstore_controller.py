from fastapi import HTTPException
from schemas.requests_schema import PDFUploadRequest, ChunkIDRequest, QueryRequest
from utils.pdf_vectorizer import (
    add_pdf_to_vectorstore,
    get_chunk_by_id,
    delete_chunks_by_ids,
    delete_all_chunks,
    get_all_chunks,
    search_similar_chunks
)

async def handle_vectorize_pdf(req: PDFUploadRequest):
    try:
        topics = add_pdf_to_vectorstore(req.pdf_path, req.metadata)
        return {"message": "Vectorization successful", "importantTopics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def handle_get_chunk(chunk_id: str):
    chunk = get_chunk_by_id(chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    return chunk

async def handle_delete_chunks(req: ChunkIDRequest):
    try:
        delete_chunks_by_ids(req.chunk_ids)
        return {"message": "Chunks deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def handle_delete_all_chunks():
    try:
        success = delete_all_chunks()
        return {"message": "All chunks deleted" if success else "No chunks to delete"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def handle_get_all_chunks():
    return {"chunks": get_all_chunks()}

async def handle_search_chunks(req: QueryRequest):
    try:
        results = search_similar_chunks(req.query, k=req.top_k)
        return {"results": [chunk.page_content for chunk in results]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

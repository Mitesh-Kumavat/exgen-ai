from fastapi import APIRouter, HTTPException
from schemas.requests_schema import PDFUploadRequest, ChunkIDRequest, QueryRequest
from controllers.vectorstore_controller import (
    handle_vectorize_pdf,
    handle_get_chunk,
    handle_delete_chunks,
    handle_delete_all_chunks,
    handle_get_all_chunks,
    handle_search_chunks,
)

router = APIRouter()

@router.post("/vectorize-pdf")
async def vectorize_pdf(req: PDFUploadRequest):
    return await handle_vectorize_pdf(req)

@router.get("/get-chunk/{chunk_id}")
async def get_chunk(chunk_id: str):
    return await handle_get_chunk(chunk_id)

@router.delete("/delete-chunks")
async def delete_chunks(req: ChunkIDRequest):
    return await handle_delete_chunks(req)

@router.delete("/delete-all-chunks")
async def delete_all_chunks():
    return await handle_delete_all_chunks()

@router.get("/chunks")
async def get_chunks():
    return await handle_get_all_chunks()

@router.post("/search-chunks")
async def search_chunks(req: QueryRequest):
    return await handle_search_chunks(req)

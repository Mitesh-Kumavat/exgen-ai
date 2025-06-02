from pydantic import BaseModel
from typing import List, Dict

class PDFUploadRequest(BaseModel):
    pdf_path: str
    metadata: Dict

class ChunkIDRequest(BaseModel):
    chunk_ids: List[str]

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    

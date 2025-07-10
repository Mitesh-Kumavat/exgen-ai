from fastapi import FastAPI
from routes.vectorstore_routes import router as vectorstore_router
from routes.exam_routes import router as exam_router

def register_routes(app: FastAPI):
    app.include_router(vectorstore_router, prefix="/api/v1", tags=["Vectorstore"])
    app.include_router(exam_router, prefix="/api/v1", tags=["Exam"])

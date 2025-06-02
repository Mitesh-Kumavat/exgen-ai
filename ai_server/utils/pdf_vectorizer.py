from dotenv import load_dotenv
from typing import List, Dict
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings
from llms.important_topic_generator import find_important_topics

load_dotenv()

CHROMA_DIR = "exgenai_vector_store"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

_embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
_vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=_embeddings)

def add_pdf_to_vectorstore(pdf_path: str, metadata: Dict) -> str:
    print(metadata, pdf_path)
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    for doc in chunks:
        doc.metadata.update(metadata)

    
    full_text = "\n\n".join([chunk.page_content for chunk in chunks])

    result = find_important_topics(str(full_text))
    
    ids = _vectorstore.add_documents(documents=chunks)
    _vectorstore.persist()
    return result if result else "No important topics found."

def get_chunk_by_id(chunk_id: str) -> Document:
    results = _vectorstore._collection.get(ids=[chunk_id])
    if not results['documents']:
        return None
    return {
        "content": results['documents'][0],
        "metadata": results['metadatas'][0]
    }

def delete_chunks_by_ids(chunk_ids: List[str]) -> bool:
    _vectorstore._collection.delete(ids=chunk_ids)
    _vectorstore.persist()
    return True

def search_similar_chunks(query: str, k: int = 5) -> List[Document]:
    return _vectorstore.similarity_search(query, k=k)

def get_all_chunks() -> List[Document]:
    all_docs = _vectorstore._collection.get(include=["documents", "metadatas"])
    if not all_docs or not all_docs["documents"]:
        return []
    
    return [
        Document(page_content=doc, metadata=meta)
        for doc, meta in zip(all_docs["documents"], all_docs["metadatas"])
    ]
    
def delete_all_chunks() -> bool:
    try:
        _vectorstore._collection.delete(where={}) 
        _vectorstore.persist()
        return True
    except Exception as e:
        print(f"Error deleting all chunks: {e}")
        return False
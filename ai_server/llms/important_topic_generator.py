from langchain_huggingface import ChatHuggingFace,HuggingFaceEndpoint
from dotenv import load_dotenv
from prompts.important_topic_finder import important_topic_finder_prompt
from langchain_core.output_parsers import StrOutputParser 

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    task="text-generation",
)

model = ChatHuggingFace(llm=llm)

chain = important_topic_finder_prompt | model  | StrOutputParser()

def find_important_topics(doc: str) -> str:
    """
    Extracts important topics from the given document using a language model.

    Args:
        doc (str): The document content from which to extract important topics.

    Returns:
        str: A string containing the most important topics with brief descriptions.
        
    """
    return chain.invoke(doc)
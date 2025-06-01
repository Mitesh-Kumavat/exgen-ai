from langchain_core.prompts import PromptTemplate

important_topic_finder_prompt = PromptTemplate.from_template(
"""You are an expert question paper maker who identifies important topics from academic notes.

Analyze the following content and extract 3-6 most important topics.

Each topic must include:
- A short heading
- A brief 1-2 line description

Only return a plain string where each topic is on a new line.
Response should not include any additional text or formatting.
Just the topics and their descriptions in short texts.

Content:
{doc}
"""
)

from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from app.services.vector_store import get_vector_store
from app.services.retriever import retrieve_documents

load_dotenv()


llm = ChatAnthropic(model_name="claude-sonnet-4-6", timeout=30, stop=None)


vector_store = get_vector_store()


prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant.

Answer the question using ONLY the provided context.

If the answer is not present in the context,
say that you don't know.

Context:
{context}

Query:
{query}

Answer:
""")


def ask_chatbot(query: str):
    documents = retrieve_documents(query)
    context = "\n\n".join(document.page_content for document in documents)
    messages = prompt.format_messages(context=context, query=query)
    response = llm.invoke(messages)
    return {"answer": response.content, "sources": documents}

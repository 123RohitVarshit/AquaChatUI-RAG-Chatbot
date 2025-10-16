import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_astradb import AstraDBVectorStore
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.schema import Document
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Neer Sahayak - Water Filter Assistant", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global variable to hold the initialized RAG chain
RAG_CHAIN = None
VECTOR_STORE = None

def initialize_components():
    """Initialize all RAG components"""
    global RAG_CHAIN, VECTOR_STORE
    
    if RAG_CHAIN is not None:
        return RAG_CHAIN, VECTOR_STORE
    
    logger.info("Initializing RAG components...")
    
    try:
        # 1. Initialize Embeddings - Use the same model as your vector store
        gemini_embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",  # Changed to match your setup
            google_api_key=os.environ.get("GOOGLE_API_KEY")
        )
        
        # 2. Initialize LLM with better parameters
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.2,  # Slightly higher for more natural responses
            google_api_key=os.environ.get("GOOGLE_API_KEY"),
            convert_system_message_to_human=True  # Important for proper formatting
        )
        
        # 3. Initialize AstraDB Vector Store
        vector_store = AstraDBVectorStore(
            embedding=gemini_embeddings,
            collection_name="water_filter_data",
            api_endpoint=os.environ["ASTRA_DB_API_ENDPOINT"],
            token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
            namespace=os.environ.get("ASTRA_DB_KEYSPACE", "default_keyspace"),
        )
        
        # 4. Test vector store connection
        logger.info("Testing vector store connection...")
        test_results = vector_store.similarity_search("water filter", k=1)
        logger.info(f"Vector store test successful. Found {len(test_results)} documents.")
        
        # 5. Initialize Enhanced Retriever
        retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "k": 6,  # Increased for better coverage
                "score_threshold": 0.3  # Lower threshold for broader matches
            }
        )
        
        # 6. Create Enhanced Prompt Template
        template = """You are 'Neer Sahayak', a knowledgeable and friendly customer support assistant for a water filter company in India.

INSTRUCTIONS:
1. If the user's question can be answered using the provided context, answer it comprehensively using that information.
2. If the context doesn't contain relevant information for the user's question, you can provide general helpful information about water purification, but clearly indicate when you're providing general knowledge.
3. Always be helpful, conversational, and customer-focused.
4. Format your responses with bullet points or short paragraphs for better readability.
5. When recommending products, mention specific models and prices when available in the context.

CONTEXT FROM OUR DATABASE:
{context}

USER QUESTION: {input}

RESPONSE:"""
        
        prompt = ChatPromptTemplate.from_template(template)
        
        # 7. Create the RAG Chain
        document_chain = create_stuff_documents_chain(llm, prompt)
        chain = create_retrieval_chain(retriever, document_chain)
        
        # 8. Store in global variables
        RAG_CHAIN = chain
        VECTOR_STORE = vector_store
        
        logger.info("RAG chain initialized successfully.")
        return RAG_CHAIN, VECTOR_STORE
        
    except KeyError as e:
        logger.error(f"Missing environment variable: {e}")
        raise HTTPException(status_code=500, detail=f"Configuration error: Missing {e}")
    except Exception as e:
        logger.error(f"Error initializing RAG chain: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize AI system: {str(e)}")

def enhance_response_with_context_info(response: Dict[str, Any]) -> Dict[str, Any]:
    """Add metadata about context usage to the response"""
    context_docs = response.get("context", [])
    
    # Add context information
    response["context_used"] = len(context_docs) > 0
    response["num_sources"] = len(context_docs)
    
    if context_docs:
        # Extract source information
        sources = []
        for doc in context_docs:
            if hasattr(doc, 'metadata'):
                sources.append({
                    "content_preview": doc.page_content[:100] + "..." if len(doc.page_content) > 100 else doc.page_content,
                    "metadata": doc.metadata
                })
        response["sources"] = sources
    
    return response

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    status: str = "success"
    context_used: bool = False
    num_sources: int = 0

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Neer Sahayak API is running", 
        "status": "healthy", 
        "environment": "codespaces"
    }

@app.get("/health")
async def health_check():
    """Detailed health check with vector store test"""
    try:
        chain, vector_store = initialize_components()
        
        # Test a simple query
        test_response = await chain.ainvoke({"input": "What is TDS?"})
        
        return {
            "status": "healthy", 
            "rag_chain": "initialized",
            "vector_store": "connected",
            "test_query": "successful",
            "environment": "codespaces"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}

@app.post("/api/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    """
    Process user queries about water filters and return AI-generated responses.
    """
    try:
        # Input validation
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        logger.info(f"Processing query: {request.query[:50]}...")
        
        # Get the initialized RAG chain
        chain, vector_store = initialize_components()
        
        # Process the query
        response = await chain.ainvoke({"input": request.query.strip()})
        
        # Enhance response with context information
        enhanced_response = enhance_response_with_context_info(response)
        
        logger.info(f"Query processed successfully. Context used: {enhanced_response.get('context_used', False)}")
        
        return QueryResponse(
            answer=enhanced_response["answer"],
            status="success",
            context_used=enhanced_response.get("context_used", False),
            num_sources=enhanced_response.get("num_sources", 0)
        )
        
    except HTTPException:
        raise
    except ValueError as ve:
        logger.error(f"Validation error: {ve}")
        raise HTTPException(status_code=400, detail="Invalid input provided")
    except Exception as e:
        logger.error(f"Unexpected error in chat_endpoint: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Sorry, something went wrong. Please try again in a moment."
        )

@app.get("/api/test-retrieval/{query}")
async def test_retrieval(query: str):
    """Test endpoint to check what documents are being retrieved"""
    try:
        _, vector_store = initialize_components()
        
        # Test similarity search
        docs = vector_store.similarity_search(query, k=5)
        
        return {
            "query": query,
            "num_results": len(docs),
            "results": [
                {
                    "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                    "metadata": doc.metadata
                } for doc in docs
            ]
        }
    except Exception as e:
        logger.error(f"Test retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vector-store-info")
async def vector_store_info():
    """Get information about the vector store"""
    try:
        _, vector_store = initialize_components()
        
        # Test with a known query from your data
        test_queries = ["AquaPure", "RO purifier", "TDS", "water filter"]
        results = {}
        
        for query in test_queries:
            docs = vector_store.similarity_search(query, k=3)
            results[query] = {
                "count": len(docs),
                "top_result": docs[0].page_content[:100] + "..." if docs else "No results"
            }
        
        return {
            "vector_store": "connected",
            "test_results": results
        }
    except Exception as e:
        logger.error(f"Vector store info failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "chat:app", 
        host="0.0.0.0",
        port=8000, 
        reload=True,
        log_level="info"
    )

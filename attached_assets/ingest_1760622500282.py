import os
from dotenv import load_dotenv
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_astradb import AstraDBVectorStore

load_dotenv()

CSV_PATH="data/water_filter_data.csv"
ASTRA_DB_COLLECTION_NAME="water_filter_data"

def ingest_data():
    loader=CSVLoader(file_path=CSV_PATH)
    documents=loader.load()
    print(f"Loaded{len(documents)} documents from CSV")

    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=150)
    docs=text_splitter.split_documents(documents)
    print(f"Split into {len(docs)} text chunks")

    gemini_embeddings=GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    vector_store=AstraDBVectorStore(
        embedding=gemini_embeddings,
        collection_name=ASTRA_DB_COLLECTION_NAME,
        api_endpoint=os.environ["ASTRA_DB_API_ENDPOINT"],
        token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
        namespace=os.environ["ASTRA_DB_KEYSPACE"]
    )

    print(f"Adding {len(docs)} documents to Astra DB collection '{ASTRA_DB_COLLECTION_NAME}'...")
    inserted_ids = vector_store.add_documents(docs)
    print(f"\nSuccessfully inserted {len(inserted_ids)} documents.")
    print("--- Data Ingestion Complete ---")
 
if __name__ == '__main__':
    ingest_data()
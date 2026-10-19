import os
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_LLM_MODEL = os.getenv("OLLAMA_LLM_MODEL", "qwen2.5:3b")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

GRAPH_MAX_NODES = int(os.getenv("GRAPH_MAX_NODES", "180"))
GRAPH_MAX_RELATIONSHIPS = int(os.getenv("GRAPH_MAX_RELATIONSHIPS", "260"))
TOP_K = int(os.getenv("TOP_K", "5"))
EMBEDDING_DIMENSIONS = 768

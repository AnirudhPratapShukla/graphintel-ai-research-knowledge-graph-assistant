from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.graph.neo4j_client import neo4j_client

@asynccontextmanager
async def lifespan(app):
    try:
        neo4j_client.initialize()
    except Exception:
        pass
    yield
    neo4j_client.close()

app = FastAPI(
    title="GraphIntel API",
    version="0.1.0",
    description="Interactive GraphRAG research assistant using SerpApi, Neo4j and Ollama.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"service":"GraphIntel","docs":"/docs","api":"/api"}

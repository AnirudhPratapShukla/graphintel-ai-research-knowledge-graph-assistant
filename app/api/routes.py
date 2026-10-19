from fastapi import APIRouter, HTTPException
from app.graph.neo4j_client import neo4j_client
from app.ingestion.pipeline import pipeline
from app.models.schemas import ResearchRequest, AskRequest
from app.rag.generator import answerer
from app.rag.retriever import get_retriever

router = APIRouter()

@router.get("/health")
def health():
    try:
        neo4j_client.verify()
        return {"status":"ok","service":"graphintel-api","neo4j":True}
    except Exception as exc:
        return {"status":"ok","service":"graphintel-api","neo4j":False,"error":str(exc)}

@router.post("/demo/seed")
def seed_demo():
    try:
        neo4j_client.seed_demo()
        return {"status":"seeded","graph":neo4j_client.fetch_graph()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/graph")
def graph():
    try:
        return neo4j_client.fetch_graph()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/research")
def research(request: ResearchRequest):
    try:
        result = pipeline.run(request.query, request.limit)
        return {"query":request.query, **result, "graph":neo4j_client.fetch_graph()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/ask")
def ask(request: AskRequest):
    try:
        evidence = get_retriever().search_structured(
            query_text=request.question,
            top_k=request.top_k,
        )

        # Preserve the existing GraphRAG answer-generation flow.
        response = answerer.ask(request.question, request.top_k)

        return {
            "question": request.question,
            "answer": response.answer,
            "evidence": evidence,
            "graph": neo4j_client.fetch_graph(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

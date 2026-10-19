from typing import Any
from pydantic import BaseModel, Field

class ResearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=300)
    limit: int = Field(default=5, ge=1, le=10)

class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=500)
    top_k: int = Field(default=5, ge=1, le=10)

class ResearchResponse(BaseModel):
    query: str
    sources: int
    entities: int
    relationships: int
    graph: dict[str, Any]

class AskResponse(BaseModel):
    question: str
    answer: str
    evidence: list[dict[str, Any]]
    graph: dict[str, Any]

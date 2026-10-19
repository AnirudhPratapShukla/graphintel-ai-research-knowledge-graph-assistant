from neo4j_graphrag.generation import GraphRAG
from neo4j_graphrag.llm import OllamaLLM
from app import config
from app.rag.retriever import get_retriever


class GraphAnswerer:
    def __init__(self):
        self.rag = None

    def _initialize(self):
        if self.rag is None:
            llm = OllamaLLM(
                model_name=config.OLLAMA_LLM_MODEL,
                host=config.OLLAMA_HOST,
                model_params={"temperature": 0},
            )
            self.rag = GraphRAG(
                retriever=get_retriever().retriever,
                llm=llm,
            )

    def ask(self, question, top_k=5):
        self._initialize()
        return self.rag.search(
            query_text=question,
            retriever_config={"top_k": top_k},
        )


answerer = GraphAnswerer()

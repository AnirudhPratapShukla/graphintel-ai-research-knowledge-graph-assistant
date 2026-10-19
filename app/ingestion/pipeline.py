from ollama import Client
from app import config
from app.ingestion.serpapi_client import serpapi_client
from app.ingestion.extractor import extractor
from app.graph.neo4j_client import neo4j_client

class ResearchPipeline:
    def __init__(self):
        self.embed_client = Client(host=config.OLLAMA_HOST)

    def run(self, query, limit=5):
        results = serpapi_client.search(query, limit)
        if not results:
            return {"sources":0,"entities":0,"relationships":0}
        combined = "\n\n".join(
            f"TITLE: {r['title']}\nURL: {r['link']}\nSNIPPET: {r['snippet']}"
            for r in results
        )
        extracted = extractor.extract(combined)
        entities = extracted.get("entities", [])
        relationships = extracted.get("relationships", [])

        embeddings = []
        for r in results:
            text = f"{r['title']}\n{r['snippet']}\n{r['link']}"
            emb = self.embed_client.embeddings(
                model=config.OLLAMA_EMBED_MODEL,
                prompt=text,
            )
            embeddings.append(emb["embedding"])

        neo4j_client.upsert_research(
            query, results, entities, relationships, embeddings
        )
        return {
            "sources": len(results),
            "entities": len(entities),
            "relationships": len(relationships),
        }

pipeline = ResearchPipeline()

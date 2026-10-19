# GraphIntel — Interactive GraphRAG Research Assistant

GraphIntel is a focused GraphRAG application that searches the web with SerpApi, extracts entities and relationships with a local Ollama model, stores the knowledge graph in Neo4j, and answers questions using Neo4j GraphRAG retrieval.

The React command center is intentionally interactive rather than static. The graph supports force-directed layouts, zoom/pan, node selection, node-type filters, node-size controls, edge-length controls, and live styling based on connectivity.

## Architecture

```text
User Question
     |
     v
React Graph Command Center
     |
     v
FastAPI
  |       \
  |        \--> SerpApi --> Search Results
  |
  +--> Neo4j Knowledge Graph
  |       |
  |       +--> Entity nodes
  |       +--> Document nodes + embeddings
  |       +--> Source nodes
  |       +--> RELATED_TO relationships
  |
  +--> Neo4j GraphRAG
          |
          +--> vector similarity
          +--> Cypher graph traversal
          |
          v
       Ollama LLM
          |
          v
    Answer + evidence
```

## MVP

- Live web research through SerpApi
- LLM entity/relationship extraction with Ollama
- Neo4j graph storage
- Neo4j vector index
- Vector + graph retrieval with VectorCypherRetriever
- GraphRAG answer generation
- Interactive Cytoscape.js graph
- Node-type filtering
- Node size slider
- Edge length slider
- Layout selector
- Click a node to inspect it
- Source/evidence panel
- Demo graph seeding for a zero-cost UI demonstration

## Fast demo

1. Start Neo4j.
2. Start Ollama.
3. Ensure `qwen2.5:3b` and `nomic-embed-text` exist.
4. Start FastAPI.
5. Start React.
6. Open the UI and click **Load Demo**.
7. Move the **Edge Length** and **Node Size** sliders.
8. Click nodes and change filters.
9. Ask: `How are Kubernetes, Docker, AWS and Terraform connected?`
10. Optionally run a live SerpApi research query.

## Future enhancements

- Graph path highlighting for an answer
- Entity/relationship confidence
- Saved research sessions
- richer source ingestion
- optional cloud LLM provider
- Neo4j Bloom export

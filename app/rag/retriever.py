from neo4j_graphrag.retrievers import VectorCypherRetriever
from neo4j_graphrag.embeddings import OllamaEmbeddings
from app import config
from app.graph.neo4j_client import neo4j_client


class GraphRetriever:
    def __init__(self):
        self.embedder = OllamaEmbeddings(
            model=config.OLLAMA_EMBED_MODEL,
            host=config.OLLAMA_HOST,
        )

        retrieval_query = """
        RETURN
          node.title AS title,
          node.content AS content,
          node.url AS url,
          score,
          collect {
            MATCH (node)-[:MENTIONS]->(e:Entity)
            RETURN {name:e.name,type:e.entity_type,description:e.description}
          } AS entities,
          collect {
            MATCH (node)-[:MENTIONS]->(e:Entity)
            MATCH (e)-[r:RELATED_TO]-(neighbor:Entity)
            RETURN {source:e.name,relation:r.relation,target:neighbor.name}
            LIMIT 20
          } AS relationships
        """

        self.retriever = VectorCypherRetriever(
            driver=neo4j_client.driver,
            index_name="document_embedding",
            retrieval_query=retrieval_query,
            embedder=self.embedder,
            neo4j_database=config.NEO4J_DATABASE,
        )

    def search_structured(self, query_text, top_k=5):
        # Generate the query embedding with the same model as the index.
        embedding = self.embedder.embed_query(query_text)

        cypher = """
        CALL db.index.vector.queryNodes(
            $index_name, $top_k, $embedding
        ) YIELD node, score

        CALL {
            WITH node
            OPTIONAL MATCH (node)-[:MENTIONS]->(e:Entity)
            RETURN collect(DISTINCT CASE
                WHEN e IS NULL THEN null
                ELSE {
                    name: e.name,
                    type: e.entity_type,
                    description: e.description
                }
            END) AS raw_entities
        }

        CALL {
            WITH node
            OPTIONAL MATCH (node)-[:MENTIONS]->(e:Entity)
                          -[r:RELATED_TO]-(neighbor:Entity)
            RETURN collect(DISTINCT CASE
                WHEN e IS NULL THEN null
                ELSE {
                    source: e.name,
                    relation: r.relation,
                    target: neighbor.name
                }
            END)[0..20] AS raw_relationships
        }

        RETURN
            node.title AS title,
            node.url AS url,
            node.content AS content,
            score AS score,
            [item IN raw_entities WHERE item IS NOT NULL] AS entities,
            [item IN raw_relationships WHERE item IS NOT NULL]
                AS relationships
        ORDER BY score DESC
        """

        with neo4j_client.driver.session(
            database=config.NEO4J_DATABASE
        ) as session:
            records = session.run(
                cypher,
                index_name="document_embedding",
                top_k=max(1, int(top_k)),
                embedding=embedding,
            )
            return [dict(record) for record in records]


_retriever = None


def get_retriever():
    global _retriever
    if _retriever is None:
        _retriever = GraphRetriever()
    return _retriever

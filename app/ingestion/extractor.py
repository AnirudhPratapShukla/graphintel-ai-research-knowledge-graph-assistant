import json
import re
from ollama import Client
from app import config

class KnowledgeExtractor:
    def __init__(self):
        self.client = Client(host=config.OLLAMA_HOST)

    def extract(self, text):
        prompt = f"""
Extract a compact knowledge graph from the research text below.
Return ONLY JSON:
{{
  "entities":[
    {{"name":"string","entity_type":"Technology|Company|Person|Concept|Product|Service","description":"short description"}}
  ],
  "relationships":[
    {{"source":"exact entity name","target":"exact entity name","relation":"SHORT_RELATION"}}
  ]
}}
Rules:
- Keep 5-20 important entities.
- Do not invent unsupported entities.
- Relationship names should be concise, e.g. USES, RUNS_ON, PROVISIONS, SUPPORTS, INTEGRATES_WITH.
- Avoid duplicate entities.

RESEARCH:
{text[:12000]}
"""
        response = self.client.chat(
            model=config.OLLAMA_LLM_MODEL,
            messages=[{"role":"user","content":prompt}],
            format="json",
            options={"temperature": 0},
        )
        content = response["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass
        return {"entities": [], "relationships": []}

extractor = KnowledgeExtractor()

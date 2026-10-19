import os
import serpapi

class SerpApiClient:
    def __init__(self):
        key = os.getenv("SERPAPI_KEY", "")
        self.client = serpapi.Client(api_key=key) if key else None

    def search(self, query, limit=5):
        if not self.client:
            raise RuntimeError("SERPAPI_KEY is not configured.")
        results = self.client.search({
            "engine": "google",
            "q": query,
            "num": limit,
            "hl": "en",
            "gl": "us",
            "output": "json",
        })
        return [
            {
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", ""),
            }
            for item in results.get("organic_results", [])[:limit]
        ]

serpapi_client = SerpApiClient()

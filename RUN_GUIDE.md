# GraphIntel — Run Guide

## Project path

```powershell
D:\Cloudsoft Practice\All_Resource\GraphIntel
```

## 1. Python environment

```powershell
cd "D:\Cloudsoft Practice\All_Resource\GraphIntel"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` with Neo4j credentials and your SerpApi key.

## 2. Ollama

Terminal 1:

```powershell
ollama serve
```

Terminal 2:

```powershell
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
ollama list
```

## 3. Neo4j

Use Neo4j Desktop/Server or Neo4j Aura and put the connection details in `.env`.

## 4. FastAPI

```powershell
cd "D:\Cloudsoft Practice\All_Resource\GraphIntel"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Health check:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/api/health"
```

## 5. React

```powershell
cd "D:\Cloudsoft Practice\All_Resource\GraphIntel\web-ui"
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 6. Zero-cost demo

Click **Load Demo**.

Then:

- move Edge Length
- move Node Size
- change Layout
- filter node types
- click nodes
- ask a question

## 7. Live research

Use:

```text
Kubernetes AWS Terraform
```

and click **Research**.

## 8. Tests

```powershell
python -m pytest tests -v
```

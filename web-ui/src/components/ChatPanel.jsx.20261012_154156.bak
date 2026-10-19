import {useState} from 'react'

export default function ChatPanel({onAsk, loading, answer, evidence}) {
  const [question, setQuestion] = useState(
    'How are Kubernetes, Docker, AWS and Terraform connected?'
  )

  async function submit(e) {
    e.preventDefault()
    if (question.trim()) await onAsk(question)
  }

  return (
    <section className="chat-panel panel">
      <div className="panel-title">GraphRAG analyst</div>

      <form onSubmit={submit} className="question-form">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          placeholder="Ask a relationship-aware question..."
        />
        <button className="primary-btn" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask GraphRAG'}
        </button>
      </form>

      <div className="answer-box">
        <div className="eyebrow">Answer</div>
        <div className="answer-text">
          {answer || 'Ask a question to generate a graph-aware answer.'}
        </div>
      </div>

      <div className="evidence">
        <div className="evidence-heading">
          <div className="eyebrow">Retrieved evidence</div>
          <span className="evidence-count">
            {evidence?.length || 0} sources
          </span>
        </div>

        {evidence?.length ? evidence.slice(0, 5).map((item, i) => (
          <article className="evidence-item" key={`${item.url || item.title || 'source'}-${i}`}>
            <div className="evidence-item-header">
              <span className="source-number">SOURCE {i + 1}</span>
              {typeof item.score === 'number' && (
                <span className="score-pill">
                  Similarity {(item.score * 100).toFixed(1)}%
                </span>
              )}
            </div>

            <strong className="evidence-title">
              {item.title || item.name || `Evidence ${i + 1}`}
            </strong>

            {item.url && (
              <a
                className="evidence-link"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open source 
              </a>
            )}

            {item.content && (
              <p className="evidence-content">{item.content}</p>
            )}

            {item.entities?.length > 0 && (
              <div className="evidence-detail">
                <div className="detail-label">Extracted entities</div>
                <div className="entity-chips">
                  {item.entities.map((entity, j) => (
                    <span className="entity-chip" key={`${entity.name}-${j}`}>
                      {entity.name}
                      {entity.type && (
                        <span className="entity-type">{entity.type}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.relationships?.length > 0 && (
              <details className="relationship-details">
                <summary>
                  Graph relationships ({item.relationships.length})
                </summary>
                <div className="relationship-list">
                  {item.relationships.map((rel, j) => (
                    <div className="relationship-row" key={`${rel.source}-${rel.relation}-${rel.target}-${j}`}>
                      <span>{rel.source}</span>
                      <span className="relation-label">{rel.relation}</span>
                      <span>{rel.target}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </article>
        )) : (
          <div className="empty-state">
            Retrieved source documents and graph context will appear here after
            you ask a question.
          </div>
        )}
      </div>
    </section>
  )
}

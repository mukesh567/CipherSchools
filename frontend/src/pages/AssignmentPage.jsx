import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api/axios';
import { Play, Sparkles, Database, ChevronLeft, Info, Table } from 'lucide-react';

const AssignmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [hint, setHint] = useState('');
    const [loadingHint, setLoadingHint] = useState(false);
    const [loadingQuery, setLoadingQuery] = useState(false);
    const [schemas, setSchemas] = useState([]);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await api.get(`/assignments/${id}`);
                setAssignment(res.data);
                setQuery(`-- Write your SQL query here\nSELECT * FROM ${res.data.tables[0]} LIMIT 10;`);

                // Fetch schemas for all tables in assignment
                const schemaPromises = res.data.tables.map(table => api.get(`/queries/schema/${table}`));
                const schemaRes = await Promise.all(schemaPromises);
                setSchemas(schemaRes.map(r => r.data));
            } catch (err) {
                console.error('Error fetching assignment details:', err);
            }
        };
        fetchAssignment();
    }, [id]);

    const handleExecute = async () => {
        setLoadingQuery(true);
        setError(null);
        setResults(null);
        try {
            const res = await api.post('/queries/execute', { query });
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during execution');
        } finally {
            setLoadingQuery(false);
        }
    };

    const handleGetHint = async () => {
        setLoadingHint(true);
        try {
            const res = await api.post('/queries/hint', {
                assignmentId: id,
                currentQuery: query
            });
            setHint(res.data.hint);
        } catch (err) {
            setHint('Failed to load hint. Please try again.');
        } finally {
            setLoadingHint(false);
        }
    };

    if (!assignment) return <div className="loader container">Loading workspace...</div>;

    return (
        <div className="assignment-page">
            <div className="assignment-page__sidebar">
                <button onClick={() => navigate('/')} className="back-btn">
                    <ChevronLeft size={20} /> Back to Assignments
                </button>

                <section className="panel question-panel">
                    <div className="panel__header">
                        <Info size={18} /> <h2>Question</h2>
                    </div>
                    <div className="panel__body">
                        <h3>{assignment.title}</h3>
                        <p>{assignment.question}</p>
                    </div>
                </section>

                <section className="panel schema-panel">
                    <div className="panel__header">
                        <Database size={18} /> <h2>Schema Viewer</h2>
                    </div>
                    <div className="panel__body">
                        {schemas.map((schema, idx) => (
                            <div key={idx} className="table-info">
                                <h4><Table size={14} /> {schema.tableName}</h4>
                                <ul>
                                    {schema.columns.map((col, i) => (
                                        <li key={i}>{col.column_name} <span className="type">{col.data_type}</span></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="assignment-page__main">
                <div className="editor-container">
                    <div className="editor-header">
                        <div className="tabs">
                            <div className="tab active">query.sql</div>
                        </div>
                        <div className="actions">
                            <button
                                className="btn btn--hint"
                                onClick={handleGetHint}
                                disabled={loadingHint}
                            >
                                {loadingHint ? 'Thinking...' : <><Sparkles size={16} /> Get Hint</>}
                            </button>
                            <button
                                className="btn btn--run"
                                onClick={handleExecute}
                                disabled={loadingQuery}
                            >
                                {loadingQuery ? 'Running...' : <><Play size={16} /> Run Query</>}
                            </button>
                        </div>
                    </div>
                    <div className="monaco-wrapper">
                        <Editor
                            height="100%"
                            defaultLanguage="sql"
                            theme="vs-dark"
                            value={query}
                            onChange={(value) => setQuery(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                automaticLayout: true,
                                padding: { top: 16 }
                            }}
                        />
                    </div>
                </div>

                <div className="results-container">
                    <div className="results-header">
                        <div className="tabs">
                            <div className="tab active">Results</div>
                            {hint && <div className="tab tab--hint" onClick={() => setHint('')}>Clear Hint</div>}
                        </div>
                    </div>
                    <div className="results-body">
                        {hint && (
                            <div className="hint-box">
                                <div className="hint-box__header"><Sparkles size={16} /> AI Hint</div>
                                <div className="hint-box__content">{hint}</div>
                            </div>
                        )}

                        {error && <div className="error-box">{error}</div>}

                        {results && (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            {results.fields.map((field, i) => <th key={i}>{field}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.rows.map((row, i) => (
                                            <tr key={i}>
                                                {results.fields.map((field, j) => <td key={j}>{row[field]}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {results.rowCount === 0 && <div className="no-data">No results found</div>}
                            </div>
                        )}

                        {!results && !error && !hint && (
                            <div className="placeholder">
                                <Play size={48} />
                                <p>Run your query to see results here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentPage;

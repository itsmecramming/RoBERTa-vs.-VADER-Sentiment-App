import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import ComparisonDashboard from "./components/ComparisonDashboard";
import ConfusionMatrices from "./components/ConfusionMatrices";
import HistoryTable from "./components/HistoryTable";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [matrix, setMatrix] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API}/metrics`).then(r => r.json()).then(setMetrics).catch(() => { });
        fetch(`${API}/confusion-matrix`).then(r => r.json()).then(setMatrix).catch(() => { });
    }, []);

    const analyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            setResult(data);
            setHistory(prev => [
                { id: Date.now(), text, roberta: data.roberta.label, vader: data.vader.label, match: data.match },
                ...prev.slice(0, 49)
            ]);
        } catch {
            setError("Failed to connect to the API. Please make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <div className="hero-section">
                    <h1 className="hero-title">Comparative <span className="gold">Performance</span> Dashboard</h1>
                    <p className="hero-subtitle thesis-title">
                        A COMPARATIVE SENTIMENT ANALYSIS OF STUDENTS' PERCEPTIONS ON GROUP VERSUS INDIVIDUAL THESIS POLICY USING ROBERTA AND VADER
                    </p>
                    <p className="hero-subtitle">
                        University of Southern Mindanao · SY 2025–2026
                    </p>
                </div>

                <InputPanel
                    text={text}
                    setText={setText}
                    onAnalyze={analyze}
                    loading={loading}
                    error={error}
                />

                {result && <ResultsPanel result={result} />}

                {metrics && <ComparisonDashboard metrics={metrics} />}

                {matrix && <ConfusionMatrices matrix={matrix} />}

                {history.length > 0 && <HistoryTable history={history} />}
            </main>

            <footer className="footer">
                <p>© 2026 Adrian L. Garcia · BS Computer Science · University of Southern Mindanao</p>
                <p className="footer-sub">Thesis: A Comparative Sentiment Analysis Using RoBERTa and VADER</p>
            </footer>
        </div>
    );
}
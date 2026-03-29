import { useEffect, useRef } from "react";
import "./ComparisonDashboard.css";

const VERBAL = (score) => {
    if (score < 0.50) return { label: "Highly Inaccurate", color: "#C0392B" };
    if (score === 0.50) return { label: "Not Accurate", color: "#E67E22" };
    if (score < 0.80) return { label: "Moderately Accurate", color: "#F39C12" };
    return { label: "Accurate & Dependable", color: "#136207" };
};

function MetricCard({ label, roberta, vader }) {
    const rv = VERBAL(roberta);
    const vv = VERBAL(vader);
    return (
        <div className="metric-card">
            <div className="metric-label">{label}</div>
            <div className="metric-bar-row">
                <span className="metric-model-tag roberta-tag">RoBERTa</span>
                <div className="metric-track">
                    <div className="metric-fill roberta-fill" style={{ width: `${roberta * 100}%` }} />
                    <div className="threshold-line" style={{ left: "80%" }} title="80% threshold" />
                    <div className="threshold-line min" style={{ left: "50%" }} title="50% threshold" />
                </div>
                <span className="metric-score">{(roberta * 100).toFixed(2)}%</span>
            </div>
            <div className="verbal-desc" style={{ color: rv.color }}>{rv.label}</div>
            <div className="metric-bar-row" style={{ marginTop: 8 }}>
                <span className="metric-model-tag vader-tag">VADER</span>
                <div className="metric-track">
                    <div className="metric-fill vader-fill" style={{ width: `${vader * 100}%` }} />
                    <div className="threshold-line" style={{ left: "80%" }} />
                    <div className="threshold-line min" style={{ left: "50%" }} />
                </div>
                <span className="metric-score">{(vader * 100).toFixed(2)}%</span>
            </div>
            <div className="verbal-desc" style={{ color: vv.color }}>{vv.label}</div>
        </div>
    );
}

export default function ComparisonDashboard({ metrics }) {
    const { roberta, vader } = metrics;

    const metricPairs = [
        { label: "Accuracy", roberta: roberta.accuracy, vader: vader.accuracy },
        { label: "Precision", roberta: roberta.precision, vader: vader.precision },
        { label: "Recall", roberta: roberta.recall, vader: vader.recall },
        { label: "F1-Score", roberta: roberta.f1, vader: vader.f1 },
    ];

    return (
        <section>
            <div className="section-title">📈 Model Performance Comparison</div>
            <div className="card">
                <div className="dashboard-legend">
                    <div className="legend-item">
                        <span className="legend-dot roberta-dot" /> RoBERTa
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot vader-dot" /> VADER
                    </div>
                    <div className="legend-item threshold-legend">
                        <span className="legend-line green-line" /> Accurate (80%)
                    </div>
                    <div className="legend-item threshold-legend">
                        <span className="legend-line red-line" /> Minimum (50%)
                    </div>
                </div>

                <div className="metrics-grid">
                    {metricPairs.map(m => (
                        <MetricCard key={m.label} {...m} />
                    ))}
                </div>

                <div className="summary-row">
                    <div className="summary-card roberta-summary">
                        <div className="summary-model">🤖 RoBERTa</div>
                        <div className="summary-score">{(roberta.f1 * 100).toFixed(2)}%</div>
                        <div className="summary-label">F1-Score · Accurate & Dependable</div>
                    </div>
                    <div className="summary-vs">VS</div>
                    <div className="summary-card vader-summary">
                        <div className="summary-model">📖 VADER</div>
                        <div className="summary-score">{(vader.f1 * 100).toFixed(2)}%</div>
                        <div className="summary-label">F1-Score · Highly Inaccurate</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
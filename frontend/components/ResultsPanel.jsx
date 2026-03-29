import "./ResultsPanel.css";

const LABEL_ICONS = { positive: "😊", neutral: "😐", negative: "😞" };

function SentimentBar({ scores }) {
    return (
        <div className="score-bars">
            {Object.entries(scores).map(([label, val]) => (
                <div key={label} className="score-row">
                    <span className="score-label">{label}</span>
                    <div className="score-track">
                        <div
                            className={`score-fill ${label}`}
                            style={{ width: `${val}%` }}
                        />
                    </div>
                    <span className="score-val">{val}%</span>
                </div>
            ))}
        </div>
    );
}

function VaderBar({ scores }) {
    const bars = [
        { label: "negative", val: scores.neg * 100 },
        { label: "neutral", val: scores.neu * 100 },
        { label: "positive", val: scores.pos * 100 },
    ];
    return (
        <div className="score-bars">
            {bars.map(({ label, val }) => (
                <div key={label} className="score-row">
                    <span className="score-label">{label}</span>
                    <div className="score-track">
                        <div className={`score-fill ${label}`} style={{ width: `${val}%` }} />
                    </div>
                    <span className="score-val">{val.toFixed(1)}%</span>
                </div>
            ))}
        </div>
    );
}

export default function ResultsPanel({ result }) {
    const { roberta, vader, match } = result;

    return (
        <section>
            <div className="section-title">📊 Prediction Results</div>

            <div className={`match-banner ${match ? "match" : "mismatch"}`}>
                {match
                    ? "✅ Both models agree on the sentiment classification."
                    : "⚠️ Models disagree — RoBERTa and VADER produced different predictions."}
            </div>

            <div className="results-grid">
                {/* RoBERTa Card */}
                <div className={`result-card roberta-card ${roberta.label}`}>
                    <div className="result-header">
                        <div className="model-name">🤖 RoBERTa</div>
                        <div className="model-type">Transformer-Based</div>
                    </div>
                    <div className="result-main">
                        <span className="sentiment-icon">{LABEL_ICONS[roberta.label]}</span>
                        <span className={`sentiment-label ${roberta.label}`}>
                            {roberta.label.charAt(0).toUpperCase() + roberta.label.slice(1)}
                        </span>
                    </div>
                    <div className="confidence-display">
                        <span className="confidence-num">{roberta.confidence}%</span>
                        <span className="confidence-txt">Confidence</span>
                    </div>
                    <SentimentBar scores={roberta.scores} />
                </div>

                {/* VADER Card */}
                <div className={`result-card vader-card ${vader.label}`}>
                    <div className="result-header">
                        <div className="model-name">📖 VADER</div>
                        <div className="model-type">Lexicon-Based</div>
                    </div>
                    <div className="result-main">
                        <span className="sentiment-icon">{LABEL_ICONS[vader.label]}</span>
                        <span className={`sentiment-label ${vader.label}`}>
                            {vader.label.charAt(0).toUpperCase() + vader.label.slice(1)}
                        </span>
                    </div>
                    <div className="confidence-display">
                        <span className="confidence-num">{vader.compound}</span>
                        <span className="confidence-txt">Compound Score</span>
                    </div>
                    <VaderBar scores={vader.scores} />
                </div>
            </div>
        </section>
    );
}
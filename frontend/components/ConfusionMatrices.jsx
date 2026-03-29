import "./ConfusionMatrices.css";

const LABELS = ["Negative", "Neutral", "Positive"];

function HeatMap({ data, title, color }) {
    const max = Math.max(...data.flat());
    const total = data.flat().reduce((a, b) => a + b, 0);

    const getOpacity = (val) => 0.1 + (val / max) * 0.9;

    return (
        <div className="heatmap-wrapper">
            <div className="heatmap-title">{title}</div>
            <div className="heatmap-container">
                <div className="axis-label y-axis">True Label</div>
                <div className="heatmap-inner">
                    {/* Column headers */}
                    <div className="col-headers">
                        <div className="corner-cell" />
                        {LABELS.map(l => (
                            <div key={l} className="col-header">{l}</div>
                        ))}
                    </div>
                    {/* Rows */}
                    {data.map((row, ri) => (
                        <div key={ri} className="heatmap-row">
                            <div className="row-label">{LABELS[ri]}</div>
                            {row.map((val, ci) => {
                                const pct = ((val / data[ri].reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                const isDiag = ri === ci;
                                return (
                                    <div
                                        key={ci}
                                        className={`heatmap-cell ${isDiag ? "diagonal" : ""}`}
                                        style={{
                                            backgroundColor: isDiag
                                                ? `${color}${Math.round(getOpacity(val) * 255).toString(16).padStart(2, '0')}`
                                                : `rgba(200,200,200,${getOpacity(val) * 0.4})`
                                        }}
                                    >
                                        <span className="cell-val">{val}</span>
                                        <span className="cell-pct">({pct}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="axis-label x-axis">Predicted Label</div>
                </div>
            </div>
            {/* Stats */}
            <div className="heatmap-stats">
                {LABELS.map((l, i) => {
                    const correct = data[i][i];
                    const rowTotal = data[i].reduce((a, b) => a + b, 0);
                    return (
                        <div key={l} className="stat-pill">
                            <span className="stat-label">{l}</span>
                            <span className="stat-acc">{((correct / rowTotal) * 100).toFixed(1)}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ConfusionMatrices({ matrix }) {
    return (
        <section>
            <div className="section-title">🔢 Confusion Matrices</div>
            <div className="matrices-grid">
                <HeatMap
                    data={matrix.roberta}
                    title="🤖 RoBERTa Confusion Matrix"
                    color="#136207"
                />
                <HeatMap
                    data={matrix.vader}
                    title="📖 VADER Confusion Matrix"
                    color="#CC9A02"
                />
            </div>
        </section>
    );
}
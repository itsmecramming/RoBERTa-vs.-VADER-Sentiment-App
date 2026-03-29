import "./InputPanel.css";

const SAMPLES = [
    "I prefer working individually because I can focus better on my own pace.",
    "Group thesis is stressful because not everyone contributes equally.",
    "Both options have their advantages depending on the student's situation.",
];

export default function InputPanel({ text, setText, onAnalyze, loading, error }) {
    return (
        <section>
            <div className="section-title">✍️ Input Panel</div>
            <div className="card input-card">
                <label className="input-label">Enter Student Feedback</label>
                <textarea
                    className="input-textarea"
                    placeholder="Type or paste a student response about the group vs. individual thesis policy..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={5}
                />

                <div className="sample-label">Try a sample:</div>
                <div className="sample-buttons">
                    {SAMPLES.map((s, i) => (
                        <button key={i} className="sample-btn" onClick={() => setText(s)}>
                            Sample {i + 1}
                        </button>
                    ))}
                </div>

                {error && <div className="error-msg">⚠️ {error}</div>}

                <div className="input-footer">
                    <span className="char-count">{text.length} characters</span>
                    <button
                        className="analyze-btn"
                        onClick={onAnalyze}
                        disabled={loading || !text.trim()}
                    >
                        {loading ? (
                            <><span className="spinner" /> Analyzing...</>
                        ) : (
                            <> Analyze Sentiment</>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
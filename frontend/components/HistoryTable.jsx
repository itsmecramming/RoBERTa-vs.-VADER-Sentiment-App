import { useState } from "react";
import "./HistoryTable.css";

const BADGE_CLASS = { positive: "positive", neutral: "neutral", negative: "negative" };

export default function HistoryTable({ history }) {
    const [filter, setFilter] = useState("all");

    const filtered = history.filter(h => {
        if (filter === "match") return h.match;
        if (filter === "mismatch") return !h.match;
        return true;
    });

    return (
        <section>
            <div className="section-title">📋 Analysis History</div>
            <div className="card">
                <div className="history-toolbar">
                    <span className="history-count">{history.length} prediction{history.length !== 1 ? "s" : ""}</span>
                    <div className="filter-tabs">
                        {["all", "match", "mismatch"].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? "active" : ""}`}
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Input Text</th>
                                <th>RoBERTa</th>
                                <th>VADER</th>
                                <th>Agreement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-row">No records found.</td>
                                </tr>
                            ) : filtered.map((h, i) => (
                                <tr key={h.id} className={h.match ? "" : "mismatch-row"}>
                                    <td className="row-num">{filtered.length - i}</td>
                                    <td className="text-cell" title={h.text}>
                                        {h.text.length > 80 ? h.text.slice(0, 80) + "..." : h.text}
                                    </td>
                                    <td>
                                        <span className={`badge ${BADGE_CLASS[h.roberta]}`}>
                                            {h.roberta}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${BADGE_CLASS[h.vader]}`}>
                                            {h.vader}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`agree-badge ${h.match ? "agree" : "disagree"}`}>
                                            {h.match ? "✅ Match" : "⚠️ Mismatch"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
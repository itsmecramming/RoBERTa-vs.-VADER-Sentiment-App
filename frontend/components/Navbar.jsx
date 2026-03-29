import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <img
                        src="https://www.usm.edu.ph/wp-content/uploads/2025/08/2025-usm-site-logo_retina_v3.png"
                        alt="USM Logo"
                        className="navbar-logo"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="navbar-text">
                        <span className="navbar-title">Comparative Performance Dashboard</span>
                        <span className="navbar-sub">University of Southern Mindanao · BSCS Thesis 2026</span>
                    </div>
                </div>
                <div className="navbar-badge">
                    <span className="model-tag">RoBERTa</span>
                    <span className="vs">vs</span>
                    <span className="model-tag vader">VADER</span>
                </div>
            </div>
        </nav>
    );
}
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <div className="brand-mark">μ</div>

                    <div>
                        <div className="footer-title">
                            Makeμ Hackathon
                        </div>

                        <p>
                            Ideas Today. A Better Tomorrow.
                        </p>
                    </div>
                </div>

                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/checkpoint">Checkpoint</Link>
                    <Link to="/teams">Teams</Link>
                    <Link to="/leaderboard">
                        Leaderboard
                    </Link>
                </div>

                <div className="footer-copy">
                    © 2026 Makeμ × μLearn IDK
                </div>

            </div>
        </footer>
    );
};

export default Footer;
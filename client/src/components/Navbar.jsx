import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("mentor");
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="nav-container">

                <Link to="/" className="brand">
                    <div className="brand-mark">μ</div>

                    <div>
                        <span className="brand-title">Makeμ</span>
                        <span className="brand-subtitle">
                            μLearn × IDK
                        </span>
                    </div>
                </Link>

                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/checkpoint">Checkpoint</Link>
                    <Link to="/teams">Teams</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                </nav>

                <div className="nav-action">
                    {token ? (
                        <button
                            className="nav-login"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-login"
                        >
                            <LogIn size={17} />
                            Mentor Login
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;
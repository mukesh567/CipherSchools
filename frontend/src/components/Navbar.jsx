import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Terminal } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar__content">
                <Link to="/" className="navbar__logo">
                    <Database className="navbar__icon" />
                    <span>Cipher<span>SQL</span> Studio</span>
                </Link>
                <div className="navbar__links">
                    <Link to="/" className="navbar__link">Assignments</Link>
                    <button className="navbar__cta">
                        <Terminal size={18} />
                        Connect Sandbox
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

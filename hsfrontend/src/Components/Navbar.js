import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import logo from "../logo.png";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Navbar.css";

const NAV_ITEMS = [
    { path: "/", label: "Home" },
    { path: "/portfolio", label: "My Portfolio" },
    { path: "/addStock", label: "Add Stock" },
];

// to manage clicks ouutside the navbar
const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
};

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const currentPath = location.pathname;
    // here !! is used to explicitly convert a value to a boolean
    const isLoggedIn = !!localStorage.getItem('token');
    
    const toggleBodyClass = useCallback((shouldAdd) => {
        document.body.classList.toggle('menu-open', shouldAdd);
    }, []);

    useEffect(() => {
        toggleBodyClass(!isCollapsed);
        return () => toggleBodyClass(false);
    }, [isCollapsed, toggleBodyClass]);

    useEffect(() => {
        setIsCollapsed(true);
    }, [currentPath]);

    useClickOutside(navbarRef, () => setIsCollapsed(true));

    const closeNavbar = useCallback(() => setIsCollapsed(true), []);

    const handleLogout = useCallback(() => {
        confirmAlert({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                },
                { label: 'No' },
            ],
        });
    }, [navigate]);

    return (
        <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-light px-3 custom-navbar">
            <div className="brand-container">
                <Link to="/" className="d-flex align-items-center text-decoration-none">
                    <img src={logo} alt="logo" className="logo" />
                    <h5 className="me-0 mb-0 fw-bold">
                        <span className="navbar-brand brand-name">holdSmart</span>
                    </h5>
                </Link>
            </div>

            <button
                className={`navbar-toggler ${isCollapsed ? 'collapsed' : ''}`}
                type="button"
                aria-expanded={!isCollapsed}
                onClick={() => setIsCollapsed(prev => !prev)}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse justify-content-end ${isCollapsed ? '' : 'show'}`}>
                <ul className="navbar-nav fw-bold">
                    {NAV_ITEMS.map(({ path, label }, index) => (
                        <li 
                            className="nav-item" 
                            key={path}
                            style={{ '--item-index': index + 1 }}
                        >
                            <Link 
                                to={path}
                                className={`nav-link ${currentPath === path ? 'active' : ''}`}
                                onClick={closeNavbar}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item">
                        {isLoggedIn ? (
                            <button
                                className="nav-link btn btn-link"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="nav-link"
                                onClick={closeNavbar}
                            >
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
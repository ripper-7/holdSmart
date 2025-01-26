import React from "react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import "./PrivateRoute.css"; 

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 
      return decodedToken.exp < currentTime; 
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; 
    }
  };

  if (token && !isTokenExpired(token)) {
    return children;
  }
 
  return (
    <div className="private-route-container">
      <div className="private-route-overlay">
        <div className="private-route-card">
          <h2>Not Logged In?</h2>
          <p>
            That’s a Bad Investment! <br /> You must be logged in to access this
            page.
          </p>
          <div className="private-route-links">
            <Link to="/login" className="btn private">
              Log In
            </Link>
            <Link to="/signup" className="btn private">
              Sign Up
            </Link>
            <Link to="/" className="btn private">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;

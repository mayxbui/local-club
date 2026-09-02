import React, { useState } from "react";
import "./NavBar.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Import the custom context hook
import { auth } from "../Firebase";
import logo from "../../assets/local_club_logo.png";


const NavBar = () => {
  const [active, setActive] = useState("HOME");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserTab, setShowUserTab] = useState(false);
  const { userDetails } = useUser(); // Use context here
  const navigate = useNavigate();


  const handleNavClick = (section) => {
    setActive(section);
    setMenuOpen(false);

    if (section === "LOCALS") {
      navigate("/locals");
    } else if (section === "HOME") {
      navigate("/home");
    } else if (section === "SCAN") {
        navigate("/scan");
    } else if (section === "DEALS") {
        navigate("/deals");
    }

  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <img
        src={logo}
        alt="Local Club"
        className="logo-img"
        onClick={() => handleNavClick("HOME")}
      />

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {["HOME", "LOCALS", "DEALS", "SCAN"].map((item) => (
          <span
            key={item}
            className={`nav-item ${active === item ? "active" : ""}`}
            onClick={() => handleNavClick(item)}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="user-wrapper">
        {userDetails ? (
          <FaUser className="user-icon" onClick={() => setShowUserTab(!showUserTab)} />
        ) : (
          <button className="login-nav-btn" onClick={() => navigate("/login")}>
            LOGIN
          </button>
        )}
        {showUserTab && userDetails && (
          <div className="user-tab">
            <div className="user-info">
              <p className="greeting">Hi, <strong>{userDetails.name}</strong></p>
              <p className="email">{userDetails.email}</p>
              <p className="points">Points: {userDetails.points}</p>
            </div>
            <hr />
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>


      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
};

export default NavBar;

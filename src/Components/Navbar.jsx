import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navBar flex">
      <div className="logo-div">
        <img src={logo} className="logo" />
      </div>
      <div className="navbar-menu">
        <ul className="menu flex">
          <Link to={"/home"} className="list-items">
            Home
          </Link>
          <li className="list-items">About</li>
          <Link to={"/flights"} className="list-items">
            Flights
          </Link>
          <li className="list-items">Destinations</li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;

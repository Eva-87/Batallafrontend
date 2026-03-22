import React from "react";
import "./Logo.css";
import logo from "../../../assets/logo.jpg";

export default function Logo({ size = 120 }) {
  return (
    <div
      className="logo-container"
      style={{ width: size, height: size }}
    >
      <img src={logo} alt="Logo" className="logo-image" />
    </div>
  );
}

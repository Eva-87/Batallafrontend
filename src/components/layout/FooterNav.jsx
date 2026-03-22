import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button/Button";
import "./FooterNav.css";

export default function FooterNav() {
  const navigate = useNavigate();

  return (
    <div className="footer-nav">
      <Button onClick={() => navigate("/")}>⌂ Home</Button>
      <Button onClick={() => navigate("/homepage/profile")}>👥 Perfil</Button>
      <Button onClick={() => navigate("/homepage/create-room")}>➕ Sala</Button>
      <Button onClick={() => navigate("/homepage/register")}>✎ Registro</Button>
    </div>
  );
}

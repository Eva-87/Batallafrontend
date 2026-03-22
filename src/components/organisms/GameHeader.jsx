import "./GameHeader.css";

export default function GameHeader({ room, status }) {
  return (
    <header className="gr-header">
      <div className="gr-logo">¡Bienvenido a Batalla de Sabios</div>
      <div className="gr-room-code">
        Código:
        <span className="gr-room-code-box">{room.code}</span>
      </div>
      <div className={`gr-status gr-status-${status.toLowerCase()}`}>
        {status}
      </div>
    </header>
  );
}

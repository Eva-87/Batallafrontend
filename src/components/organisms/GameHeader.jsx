import "./GameHeader.css";

export default function GameHeader({ room, status }) {
  const safeStatus = typeof status === "string" ? status : "";

  return (
    <header className="gr-header">
      <div className="gr-room-code">
        Código:
        <span className="gr-room-code-box">
          {room?.code?.trim?.() || ""}
        </span>
      </div>

      <div className={`gr-status gr-status-${safeStatus.toLowerCase()}`}>
        {safeStatus}
      </div>
    </header>
  );
}

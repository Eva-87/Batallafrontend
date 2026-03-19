import PlayerList from "../molecules/PlayerList/PlayerList";
import "./GameLobby.css";

export default function GameLobby({ players, isHost, onStart }) {
  return (
    <div className="gr-panel">
      <h2>Esperando jugadores...</h2>
      <PlayerList players={players} />

      {isHost ? (
        <button className="gr-btn" onClick={onStart}>Iniciar juego</button>
      ) : (
        <p>Esperando al anfitrión...</p>
      )}
    </div>
  );
}

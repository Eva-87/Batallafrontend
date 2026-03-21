import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./GameRoomPage.css";

import GameHeader from "../../components/organisms/GameHeader";
import GameLobby from "../../components/organisms/GameLobby";
import GameQuestion from "../../components/organisms/GameQuestion";
import GameRoundResults from "../../components/organisms/GameRoundResults";
import GameFinalRanking from "../../components/organisms/GameFinalRanking";

export default function GameRoomPage() {
  const { roomCode } = useParams();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("LOBBY");

  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [roundResult, setRoundResult] = useState(null);
  const [ranking, setRanking] = useState(null);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  const isHost =
    room?.creatorId === user?.id ||
    room?.creator?.id === user?.id ||
    room?.creator?.user?.id === user?.id;

  // ---------------------------------------------------------
  // POLLING
  // ---------------------------------------------------------
  useEffect(() => {
    const poll = () => {
      fetch(`http://localhost:8080/api/rooms/${roomCode}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setRoom(data));

      fetch(`http://localhost:8080/api/rooms/${roomCode}/players`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setPlayers(data));

      fetch(`http://localhost:8080/api/rooms/${roomCode}/status`)
        .then(res => res.ok ? res.json() : null)
        .then(st => st && setStatus(st));
    };

    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [roomCode]);

  // ---------------------------------------------------------
  // TIMER
  // ---------------------------------------------------------
  useEffect(() => {
    if (!question) return;

    setTimeLeft(30);
    setSelectedIndex(null);
    setHasAnswered(false);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question]);

  // ---------------------------------------------------------
  // HOST ACTIONS
  // ---------------------------------------------------------
  const startGame = () => {
    fetch(`http://localhost:8080/api/rooms/${roomCode}/start`, {
      method: "POST"
    })
      .then(async res => {
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then(q => {
        setRoundResult(null);
        q && setQuestion(q);
      });
  };

  const nextQuestion = () => {
    fetch(`http://localhost:8080/api/rooms/${roomCode}/next`, {
      method: "POST"
    })
      .then(async res => {
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then(q => {
        setRoundResult(null);
        q && setQuestion(q);
      });
  };

  const finishGame = () => {
    fetch(`http://localhost:8080/api/rooms/${roomCode}/finish`, {
      method: "POST"
    })
      .then(async res => {
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then(data => {
        if (data) {
          setRanking(data.ranking);
          setQuestion(null);
          setRoundResult(null);
        }
      });
  };

  // ---------------------------------------------------------
  // PLAYER ACTIONS
  // ---------------------------------------------------------
  const sendAnswer = index => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedIndex(index);

    fetch(`http://localhost:8080/api/rooms/${roomCode}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        chosenIndex: index
      })
    })
      .then(async res => {
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then(result => result && setRoundResult(result));
  };

  if (!room) return <p>Cargando sala...</p>;

  return (
    <div className="gr-container">
      <GameHeader room={room} status={status} />

      {status === "LOBBY" && (
        <GameLobby
          players={players}
          isHost={isHost}
          onStart={startGame}
        />
      )}

      {status === "PLAYING" && question && (
        <GameQuestion
          question={question}
          timeLeft={timeLeft}
          selectedIndex={selectedIndex}
          hasAnswered={hasAnswered}
          onAnswer={sendAnswer}
        />
      )}

      {status === "SHOWING_RESULTS" && roundResult && (
        <GameRoundResults
          roundResult={roundResult}
          players={players}
          isHost={isHost}
          onNext={nextQuestion}
          onFinish={finishGame}
        />
      )}

      {status === "FINISHED" && ranking && (
        <GameFinalRanking ranking={ranking} />
      )}
    </div>
  );
}

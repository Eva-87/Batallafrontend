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
  const cleanRoomCode = roomCode ? roomCode.trim() : "";

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
  // POLLING GENERAL (MODIFICADO)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!cleanRoomCode) return;

    // ⛔ Si el juego terminó, NO seguir haciendo polling
    if (status === "FINISHED") return;

    const poll = () => {
      fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/status`)
        .then(res => res.json())
        .then(st => {
          if (st) setStatus(st.status);

          fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}`)
            .then(res => res.json())
            .then(data => setRoom(data));

          // 🔥 Solo pedir pregunta si el backend dice PLAYING
          if (st?.status === "PLAYING") {
            fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/question`)
              .then(res => res.json())
              .then(q => q && setQuestion(q));
          }

          fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/players`)
            .then(res => res.json())
            .then(data => setPlayers(data));
        });
    };

    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [cleanRoomCode, status]);

  // ---------------------------------------------------------
  // POLLING DE RESULTADOS DE RONDA
  // ---------------------------------------------------------
  useEffect(() => {
    if (status !== "SHOWING_RESULTS") return;

    const interval = setInterval(() => {
      fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/round-result`)
        .then(res => {
          if (!res.ok || res.status === 204) return null;
          return res.json();
        })
        .then(data => data && setRoundResult(data));
    }, 500);

    return () => clearInterval(interval);
  }, [status, cleanRoomCode]);

  // ---------------------------------------------------------
  // TIMER
  // ---------------------------------------------------------
  useEffect(() => {
    if (!question || !Array.isArray(question.options)) return;

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
  // START GAME
  // ---------------------------------------------------------
  const startGame = () => {
    fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/start`, {
      method: "POST"
    })
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : null))
      .then(q => {
        setRoundResult(null);
        if (q) {
          setQuestion(q);
          setStatus("PLAYING");
        }
      });
  };

  // ---------------------------------------------------------
  // NEXT QUESTION
  // ---------------------------------------------------------
  const nextQuestion = () => {
    fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/next`, {
      method: "POST"
    })
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : null))
      .then(q => {
        setRoundResult(null);

        if (q) {
          setQuestion(q);
          setStatus("PLAYING");
        } else {
          finishGame();
        }
      });
  };

  // ---------------------------------------------------------
  // FINISH GAME
  // ---------------------------------------------------------
  const finishGame = () => {
    fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/finish`, {
      method: "POST"
    })
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : null))
      .then(data => {
        if (data) {
          setRanking(data.ranking);
          setQuestion(null);
          setRoundResult(null);
          setStatus("FINISHED");
        }
      });
  };

  // ---------------------------------------------------------
  // 🔥 NUEVO: AUTO-FINISH PARA TODOS LOS JUGADORES
  // ---------------------------------------------------------
  useEffect(() => {
    if (status === "FINISHED" && !ranking && cleanRoomCode) {
      fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/finish`, {
        method: "POST"
      })
        .then(res => res.text())
        .then(text => (text ? JSON.parse(text) : null))
        .then(data => {
          if (data) {
            setRanking(data.ranking);
            setQuestion(null);
            setRoundResult(null);
          }
        });
    }
  }, [status, ranking, cleanRoomCode]);

  // ---------------------------------------------------------
  // SEND ANSWER
  // ---------------------------------------------------------
  const sendAnswer = index => {
    if (hasAnswered) return;

    const timeSpent = 30 - timeLeft;

    setHasAnswered(true);
    setSelectedIndex(index);

    fetch(`http://localhost:8080/api/rooms/${cleanRoomCode}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        chosenIndex: index,
        timeSpent: timeSpent
      })
    })
      .then(res => res.text())
      .then(text => (text ? JSON.parse(text) : null))
      .then(result => {
        if (!result) return;
        setRoundResult(result);
      });
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  if (!room) return <p>Cargando sala...</p>;

  return (
    <div className="gr-container">
      <GameHeader room={room} status={status} />

      {status === "LOBBY" && (
        <GameLobby players={players} isHost={isHost} onStart={startGame} />
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
          question={question}
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

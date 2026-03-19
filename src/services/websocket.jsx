import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

export default function GameRoomPage({ roomCode }) {

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/rooms/${roomCode}`, (msg) => {
        const data = JSON.parse(msg.body);
        console.log("WS EVENT:", data);
      });

      client.publish({
        destination: `/app/rooms/${roomCode}/join`,
        body: JSON.stringify(1) // userId
      });
    };

    client.activate();

    return () => client.deactivate();
  }, [roomCode]);

  return <h1>Sala {roomCode}</h1>;
}

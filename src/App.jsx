import { useEffect, useState } from "react";
import JoinGroup from "./components/JoinGroup";
import ChatRoom from "./components/ChatRoom";
import { io } from "socket.io-client";
import "./App.css";

// ✅ Railway backend URL
const SOCKET_URL = "https://real-time-chat-backend-production-f1c0.up.railway.app";
let socket;

function App() {
  const [joined, setJoined] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", room: "" });

  useEffect(() => {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"], // ✅ WebSocket + fallback polling
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = ({ username, room }) => {
    setUserInfo({ username, room });
    socket.emit("join", room);
    setJoined(true);
  };

  const handleLeave = () => {
    socket.emit("leave", userInfo.room);
    setUserInfo({ username: "", room: "" });
    setJoined(false);
  };

  return (
    <>
      {!joined ? (
        <JoinGroup onJoin={handleJoin} />
      ) : (
        <ChatRoom
          username={userInfo.username}
          room={userInfo.room}
          socket={socket}
          onLeave={handleLeave}
        />
      )}
    </>
  );
}

export default App;

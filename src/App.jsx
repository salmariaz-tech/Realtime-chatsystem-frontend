import { useEffect, useState } from "react";
import JoinGroup from "./components/JoinGroup";
import ChatRoom from "./components/ChatRoom";
import { io } from "socket.io-client";
import "./App.css";

// ✅ Use Railway backend URL (no trailing slash)
const SOCKET_URL = "https://real-time-chat-backend-production-f1c0.up.railway.app";
let socket;

function App() {
  const [joined, setJoined] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", room: "" });

  useEffect(() => {
    socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // ✅ Fallback added
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to backend:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
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

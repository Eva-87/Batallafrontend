import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/Login/LoginPage";

import CreateRoomPage from "./pages/CreateRoom/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoom/JoinRoomPage";
import GameRoomPage from "./pages/GameRoom/GameRoomPage";

import CreateQuizPage from "./pages/Quiz/CreateQuizPage";
import QuizPage from "./pages/Quiz/QuizPage";

import ProfilePage from "./pages/Profile/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/homepage/register" element={<RegisterPage />} />
        <Route path="/homepage/login" element={<LoginPage />} />

        {/* PROFILE */}
        <Route path="/homepage/profile" element={<ProfilePage />} />

        {/* ROOMS */}
        <Route path="/homepage/create-room" element={<CreateRoomPage />} />
        <Route path="/homepage/join-room" element={<JoinRoomPage />} />

        {/* GAME */}
        <Route path="/game/:roomCode" element={<GameRoomPage />} />

        {/* QUIZZES */}
        <Route path="/homepage/create-quiz" element={<CreateQuizPage />} />
        <Route path="/homepage/create-quiz/:quizId" element={<CreateQuizPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />


      </Routes>
    </BrowserRouter>
  );
}


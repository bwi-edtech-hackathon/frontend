import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Roadmap from "@/pages/Roadmap";
import ExamLanding from "@/pages/ExamLanding";
import ExamActive from "@/pages/ExamActive";
import ExamAnalyzing from "@/pages/ExamAnalyzing";
import ExamResult from "@/pages/ExamResult";
import ChatLesson from "@/pages/ChatLesson";
import Battle from "@/pages/Battle";
import Leaderboard from "@/pages/Leaderboard";
import { AppShell } from "@/components/app/AppShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/roadmap" element={<Roadmap />} />
        <Route path="/app/exam" element={<ExamLanding />} />
        <Route path="/app/exam/active" element={<ExamActive />} />
        <Route path="/app/exam/analyzing" element={<ExamAnalyzing />} />
        <Route path="/app/exam/result" element={<ExamResult />} />
        <Route path="/app/chat" element={<ChatLesson />} />
        <Route path="/app/battle" element={<Battle />} />
        <Route path="/app/leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

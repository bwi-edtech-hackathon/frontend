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
import BattleMatchmaking from "@/pages/BattleMatchmaking";
import BattleActive from "@/pages/BattleActive";
import BattleResult from "@/pages/BattleResult";
import Leaderboard from "@/pages/Leaderboard";
import QuickExamStart from "@/pages/QuickExamStart";
import { AppShell } from "@/components/app/AppShell";
import { QuickExamShell } from "@/components/app/QuickExamShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Quick exam — no login, no sidebar */}
      <Route element={<QuickExamShell />}>
        <Route path="/quick-exam/:subject" element={<QuickExamStart />} />
        <Route path="/quick-exam/active" element={<ExamActive />} />
        <Route path="/quick-exam/analyzing" element={<ExamAnalyzing />} />
        <Route path="/quick-exam/result" element={<ExamResult />} />
      </Route>

      <Route element={<AppShell />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/roadmap" element={<Roadmap />} />
        <Route path="/app/exam" element={<ExamLanding />} />
        <Route path="/app/exam/active" element={<ExamActive />} />
        <Route path="/app/exam/analyzing" element={<ExamAnalyzing />} />
        <Route path="/app/exam/result" element={<ExamResult />} />
        <Route path="/app/chat" element={<ChatLesson />} />
        <Route path="/app/battle" element={<Battle />} />
        <Route path="/app/battle/matchmaking" element={<BattleMatchmaking />} />
        <Route path="/app/battle/active" element={<BattleActive />} />
        <Route path="/app/battle/result" element={<BattleResult />} />
        <Route path="/app/leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

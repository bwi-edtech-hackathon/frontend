import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import SubjectPicker from "@/pages/SubjectPicker";
import Diagnostic from "@/pages/Diagnostic";
import Result from "@/pages/Result";
import Roadmap from "@/pages/Roadmap";
import Lesson from "@/pages/Lesson";
import { AppShell } from "@/components/app/AppShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/app" element={<SubjectPicker />} />
        <Route path="/app/diagnostic/:subject" element={<Diagnostic />} />
        <Route path="/app/result" element={<Result />} />
        <Route path="/app/roadmap" element={<Roadmap />} />
        <Route path="/app/lesson/:lessonId" element={<Lesson />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

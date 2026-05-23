import { Outlet } from "react-router-dom";
import { palette as pal } from "@/lib/palette";

export function QuickExamShell() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.bg,
        color: pal.text,
        fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
        letterSpacing: "-0.01em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Outlet />
    </div>
  );
}

import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/app/Sidebar";
import { palette as pal } from "@/lib/palette";

const FULL_BLEED_PREFIXES = [
  "/app/exam/active",
  "/app/exam/analyzing",
  "/app/exam/result",
];

export function AppShell() {
  const { pathname } = useLocation();
  const fullBleed = FULL_BLEED_PREFIXES.some((p) => pathname.startsWith(p));

  if (fullBleed) {
    return (
      <div
        style={{
          height: "100vh",
          background: pal.bg,
          color: pal.text,
          fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
          letterSpacing: "-0.01em",
        }}
      >
        <Outlet />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: pal.bg,
        color: pal.text,
        fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
        letterSpacing: "-0.01em",
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

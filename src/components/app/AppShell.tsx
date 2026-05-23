import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/app/Sidebar";
import { palette as pal } from "@/lib/palette";
import { useIsAtMostTablet } from "@/hooks/useMediaQuery";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Primitives";

const FULL_BLEED_PREFIXES = [
  "/app/exam/active",
  "/app/exam/analyzing",
  "/app/exam/result",
];

export function AppShell() {
  const { pathname } = useLocation();
  const fullBleed = FULL_BLEED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAtMostTablet = useIsAtMostTablet();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  if (fullBleed) {
    return (
      <div
        style={{
          minHeight: "100vh",
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

  if (isAtMostTablet) {
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
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: pal.surface,
            borderBottom: `1px solid ${pal.line}`,
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: `1px solid ${pal.line}`,
              background: pal.surface,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="menu" size={18} />
          </button>
          <Logo pal={pal} size={16} />
        </header>

        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 50,
            }}
          />
        )}

        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            width: "min(280px, 86vw)",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease",
            zIndex: 60,
            boxShadow: drawerOpen ? "0 24px 60px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </div>

        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
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
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

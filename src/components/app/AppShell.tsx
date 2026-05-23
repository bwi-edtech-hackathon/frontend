import { Outlet, useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";

export function AppShell() {
  const navigate = useNavigate();
  const hardReset = useAppStore((s) => s.hardReset);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              hardReset();
              navigate("/app");
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
        </div>
      </header>
      <main className="container-page py-12">
        <Outlet />
      </main>
    </div>
  );
}

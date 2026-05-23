import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type Props = {
  title: string;
  onClose: () => void;
  width?: number;
  initialX?: number;
  initialY?: number;
  zIndex?: number;
  children: ReactNode;
  contentStyle?: CSSProperties;
};

export function FloatingPanel({
  title,
  onClose,
  width = 320,
  initialX,
  initialY,
  zIndex = 50,
  children,
  contentStyle,
}: Props) {
  const t = useT();
  const [pos, setPos] = useState({
    x: initialX ?? (typeof window !== "undefined" ? window.innerWidth - width - 32 : 100),
    y: initialY ?? 120,
  });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos.x, pos.y],
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag.current) return;
      setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
    },
    [],
  );
  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      drag.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width,
        zIndex,
        background: pal.surface,
        border: `1px solid ${pal.line}`,
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          background: pal.text,
          color: pal.surface,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em", flex: 1 }}>
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close")}
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: pal.surface,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="x" size={12} />
        </button>
      </div>
      <div style={{ padding: 14, ...contentStyle }}>{children}</div>
    </div>
  );
}

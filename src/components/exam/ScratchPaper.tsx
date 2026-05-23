import { useEffect, useRef, useState } from "react";
import { palette as pal } from "@/lib/palette";
import { FloatingPanel } from "@/components/exam/FloatingPanel";
import { Icon } from "@/components/ui/Icon";

const WIDTH = 360;
const HEIGHT = 320;

export function ScratchPaper({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [stroke, setStroke] = useState<"ink" | "highlight">("ink");

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFEF8";
    ctx.fillRect(0, 0, c.width, c.height);
    // Faint ruled lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let y = 24; y < c.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
  }, []);

  const localPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * c.width) / rect.width,
      y: ((e.clientY - rect.top) * c.height) / rect.height,
    };
  };

  const begin = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = localPoint(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const p = localPoint(e);
    ctx.strokeStyle =
      stroke === "ink" ? "rgba(15,18,18,0.92)" : "rgba(238,142,115,0.55)";
    ctx.lineWidth = stroke === "ink" ? 1.8 : 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (last.current) {
      ctx.moveTo(last.current.x, last.current.y);
    }
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    last.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFEF8";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let y = 24; y < c.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
  };

  const ToolBtn = ({
    on,
    label,
    onClick,
    icon,
  }: {
    on?: boolean;
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${on ? pal.primary : pal.line}`,
        background: on ? pal.primarySoft : pal.surface,
        color: on ? pal.primary : pal.text,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "inherit",
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <FloatingPanel
      title="Scratch paper"
      onClose={onClose}
      width={WIDTH + 28}
      initialX={typeof window !== "undefined" ? window.innerWidth - WIDTH - 60 : 100}
      initialY={260}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <ToolBtn
          on={stroke === "ink"}
          label="Pen"
          onClick={() => setStroke("ink")}
          icon={<Icon name="sparkle" size={12} />}
        />
        <ToolBtn
          on={stroke === "highlight"}
          label="Highlighter"
          onClick={() => setStroke("highlight")}
          icon={<Icon name="bolt" size={12} />}
        />
        <div style={{ flex: 1 }} />
        <ToolBtn label="Clear" onClick={clear} icon={<Icon name="x" size={12} />} />
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{
          width: WIDTH,
          height: HEIGHT,
          borderRadius: 8,
          border: `1px solid ${pal.line}`,
          touchAction: "none",
          cursor: "crosshair",
          display: "block",
        }}
      />
    </FloatingPanel>
  );
}

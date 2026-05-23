import type { CSSProperties, ReactNode, MouseEventHandler } from "react";
import { palette as defaultPal, type Palette } from "@/lib/palette";
import { Icon } from "@/components/ui/Icon";

type WithPal = { pal?: Palette };

// ───────────────────────────── Pill ─────────────────────────────
export type PillTone =
  | "muted"
  | "primary"
  | "primarySoft"
  | "accent"
  | "accentSoft"
  | "outline"
  | "ghost"
  | "good"
  | "bad";

type PillProps = WithPal & {
  children: ReactNode;
  tone?: PillTone;
  dark?: boolean;
  style?: CSSProperties;
  icon?: ReactNode;
};

export function Pill({
  children,
  tone = "muted",
  pal = defaultPal,
  dark = false,
  style = {},
  icon,
}: PillProps) {
  const map: Record<PillTone, { bg: string; fg: string; border: string }> = {
    muted: {
      bg: dark ? pal.battleLine : pal.surfaceAlt,
      fg: dark ? pal.battleInk : pal.muted,
      border: dark ? pal.battleLine : pal.line,
    },
    primary: { bg: pal.primary, fg: pal.primaryInk, border: pal.primary },
    primarySoft: { bg: pal.primarySoft, fg: pal.primary, border: "transparent" },
    accent: { bg: pal.accent, fg: pal.accentInk, border: pal.accent },
    accentSoft: { bg: pal.accentSoft, fg: pal.accentInk, border: "transparent" },
    outline: {
      bg: "transparent",
      fg: dark ? pal.battleInk : pal.text,
      border: dark ? pal.battleLine : pal.line,
    },
    ghost: {
      bg: "transparent",
      fg: dark ? pal.battleInk : pal.muted,
      border: "transparent",
    },
    good: { bg: "#E4F2E7", fg: pal.good, border: "transparent" },
    bad: { bg: "#FBE2DF", fg: pal.bad, border: "transparent" },
  };
  const c = map[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

// ───────────────────────────── Btn ─────────────────────────────
export type BtnTone =
  | "primary"
  | "accent"
  | "dark"
  | "ghost"
  | "outline"
  | "soft";

export type BtnSize = "sm" | "md" | "lg" | "xl";

type BtnProps = WithPal & {
  children?: ReactNode;
  tone?: BtnTone;
  size?: BtnSize;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  full?: boolean;
  style?: CSSProperties;
  dark?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
};

export function Btn({
  children,
  tone = "primary",
  pal = defaultPal,
  size = "md",
  icon,
  iconAfter,
  full,
  style = {},
  dark = false,
  onClick,
  type = "button",
}: BtnProps) {
  const sizes: Record<BtnSize, { h: number; pad: string; fs: number; gap: number }> = {
    sm: { h: 32, pad: "0 12px", fs: 13, gap: 6 },
    md: { h: 44, pad: "0 18px", fs: 14, gap: 8 },
    lg: { h: 56, pad: "0 22px", fs: 16, gap: 10 },
    xl: { h: 64, pad: "0 26px", fs: 18, gap: 12 },
  };
  const tones: Record<BtnTone, { bg: string; fg: string; border: string }> = {
    primary: { bg: pal.primary, fg: pal.primaryInk, border: pal.primary },
    accent: { bg: pal.accent, fg: pal.accentInk, border: pal.accent },
    dark: { bg: "#171A17", fg: "#fff", border: "#171A17" },
    ghost: {
      bg: "transparent",
      fg: dark ? pal.battleInk : pal.text,
      border: "transparent",
    },
    outline: {
      bg: dark ? "transparent" : pal.surface,
      fg: dark ? pal.battleInk : pal.text,
      border: dark ? pal.battleLine : pal.line,
    },
    soft: { bg: pal.primarySoft, fg: pal.primary, border: "transparent" },
  };
  const s = sizes[size];
  const t = tones[tone];
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        height: s.h,
        padding: s.pad,
        borderRadius: 14,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        fontSize: s.fs,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        width: full ? "100%" : "auto",
        cursor: "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {icon}
      {children}
      {iconAfter}
    </button>
  );
}

// ───────────────────────────── Card ─────────────────────────────
type CardProps = WithPal & {
  children: ReactNode;
  dark?: boolean;
  pad?: number;
  style?: CSSProperties;
};

export function Card({
  children,
  pal = defaultPal,
  dark = false,
  pad = 16,
  style = {},
}: CardProps) {
  return (
    <div
      style={{
        background: dark ? pal.battleSurface : pal.surface,
        border: `1px solid ${dark ? pal.battleLine : pal.line}`,
        borderRadius: 20,
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ───────────────────────────── Avatar ─────────────────────────────
type AvatarProps = {
  name?: string;
  size?: number;
  hue?: number;
  bg?: string;
  fg?: string;
  ring?: string;
};

export function Avatar({
  name = "?",
  size = 36,
  hue = 30,
  bg,
  fg,
  ring,
}: AvatarProps) {
  const initial = name[0]?.toUpperCase() || "?";
  const bgC = bg || `oklch(0.85 0.08 ${hue})`;
  const fgC = fg || `oklch(0.32 0.08 ${hue})`;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bgC,
        color: fgC,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.42,
        letterSpacing: "-0.01em",
        flexShrink: 0,
        boxShadow: ring ? `0 0 0 3px ${ring}` : undefined,
      }}
    >
      {initial}
    </div>
  );
}

// ───────────────────────────── Logo ─────────────────────────────
export function Logo({
  pal = defaultPal,
  size = 22,
  dark = false,
}: WithPal & { size?: number; dark?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 700,
        letterSpacing: "-0.025em",
      }}
    >
      <Icon name="logo" size={size + 4} color={pal.primary} />
      <span style={{ fontSize: size, color: dark ? pal.battleInk : pal.text }}>
        Coach<span style={{ color: pal.primary }}>AI</span>
      </span>
    </span>
  );
}

// ───────────────────────────── Progress ─────────────────────────────
type ProgressProps = WithPal & {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  dark?: boolean;
  style?: CSSProperties;
};

export function Progress({
  value,
  max = 100,
  pal = defaultPal,
  color,
  height = 6,
  dark = false,
  style = {},
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      style={{
        height,
        borderRadius: 999,
        overflow: "hidden",
        background: dark ? pal.battleLine : pal.line,
        ...style,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color || pal.primary,
          borderRadius: 999,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

// ───────────────────────────── Ring ─────────────────────────────
type RingProps = WithPal & {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
};

export function Ring({
  value,
  max = 100,
  size = 60,
  stroke = 6,
  color,
  track,
  label,
  sub,
  pal = defaultPal,
  dark = false,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track || (dark ? pal.battleLine : pal.line)}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color || pal.primary}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontSize: size * 0.27,
            fontWeight: 700,
            color: dark ? pal.battleInk : pal.text,
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: size * 0.14, color: pal.muted, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────── MathPill ─────────────────────────────
type MathPillProps = WithPal & {
  children: ReactNode;
  block?: boolean;
  dark?: boolean;
};

export function MathPill({
  children,
  pal = defaultPal,
  block = false,
  dark = false,
}: MathPillProps) {
  return (
    <div
      style={{
        display: block ? "block" : "inline-block",
        padding: block ? "12px 16px" : "6px 12px",
        margin: block ? "8px 0" : "0 2px",
        borderRadius: block ? 12 : 8,
        background: dark ? "rgba(255,255,255,0.05)" : pal.surfaceAlt,
        border: `1px solid ${dark ? pal.battleLine : pal.line}`,
        fontFamily: '"Newsreader", "Times New Roman", serif',
        fontStyle: "italic",
        fontSize: block ? 20 : 15,
        color: dark ? pal.battleInk : pal.text,
        textAlign: block ? "center" : "left",
      }}
    >
      {children}
    </div>
  );
}

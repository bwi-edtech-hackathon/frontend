import type { CSSProperties } from "react";

export type IconName =
  | "home"
  | "swords"
  | "map"
  | "chat"
  | "user"
  | "flame"
  | "crown"
  | "trophy"
  | "clock"
  | "check"
  | "x"
  | "lock"
  | "play"
  | "plus"
  | "send"
  | "sparkle"
  | "bell"
  | "search"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "chev-down"
  | "chev-right"
  | "bolt"
  | "shield"
  | "medal"
  | "globe"
  | "users"
  | "image"
  | "mic"
  | "menu"
  | "flag"
  | "book"
  | "logo";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  style?: CSSProperties;
};

export function Icon({
  name,
  size = 18,
  color = "currentColor",
  stroke = 1.6,
  style,
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "swords":
      return (
        <svg {...common}>
          <path d="M14.5 17.5L21 11l-1-4-4-1-6.5 6.5" />
          <path d="M9.5 6.5L3 13l1 4 4 1 6.5-6.5" />
          <path d="M15 9l-6 6" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
          <path d="M9 4v16M15 6v16" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-1 2 1 4 2 3 0-3 1-5 1-9z" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="M3 8l4 4 5-6 5 6 4-4-1 11H4z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
          <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
          <path d="M10 13h4l-1 4h2v3H9v-3h2z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M4 12l5 5 11-12" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M6 4l14 8-14 8z" fill={color} />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="M3 11l18-8-8 18-2-7z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "arrow-up":
      return (
        <svg {...common}>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      );
    case "arrow-down":
      return (
        <svg {...common}>
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      );
    case "chev-down":
      return (
        <svg {...common}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "chev-right":
      return (
        <svg {...common}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3L4 14h7l-1 7 9-11h-7z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
        </svg>
      );
    case "medal":
      return (
        <svg {...common}>
          <circle cx="12" cy="14" r="6" />
          <path d="M8 8L6 3h4l2 4M16 8l2-5h-4l-2 4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2 20a7 7 0 0 1 14 0" />
          <circle cx="17" cy="8" r="3" />
          <path d="M22 20a6 6 0 0 0-6-6" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="M21 16l-5-5-9 9" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4l8 1 6-1v9l-6 1-8-1" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" />
          <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
        </svg>
      );
    case "logo":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
          <path
            d="M20 7a8 8 0 1 0 0 10"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="20" cy="12" r="1.8" fill={color} />
        </svg>
      );
  }
}

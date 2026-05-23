import { Link, useLocation } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Primitives";

type Item = {
  to: string;
  icon: IconName;
  label: string;
  match: (pathname: string) => boolean;
  badge?: string;
};

function SidebarItem({
  to,
  icon,
  label,
  active,
  badge,
}: {
  to: string;
  icon: IconName;
  label: string;
  active: boolean;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 12,
        background: active ? pal.primarySoft : "transparent",
        color: active ? pal.primary : pal.text,
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <Icon name={icon} size={18} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span
          style={{
            fontSize: 11,
            padding: "1px 7px",
            borderRadius: 999,
            background: active ? pal.primary : pal.accent,
            color: active ? pal.primaryInk : pal.accentInk,
            fontWeight: 700,
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const t = useT();
  const { pathname } = useLocation();

  const items: Item[] = [
    {
      to: "/app",
      icon: "home",
      label: t("Dashboard"),
      match: (p) => p === "/app" || p === "/app/",
    },
    {
      to: "/app/roadmap",
      icon: "map",
      label: t("Roadmap"),
      match: (p) => p.startsWith("/app/roadmap"),
    },
    {
      to: "/app/exam",
      icon: "book",
      label: t("Mock exams"),
      match: (p) => p.startsWith("/app/exam"),
    },
    {
      to: "/app/battle",
      icon: "swords",
      label: t("Battle"),
      match: (p) => p.startsWith("/app/battle"),
      badge: "3",
    },
    {
      to: "/app/chat",
      icon: "chat",
      label: t("Chat Lesson"),
      match: (p) => p.startsWith("/app/chat"),
    },
    {
      to: "/app/leaderboard",
      icon: "trophy",
      label: t("Leaderboard"),
      match: (p) => p.startsWith("/app/leaderboard"),
    },
  ];

  return (
    <aside
      style={{
        width: 240,
        background: pal.surface,
        borderRight: `1px solid ${pal.line}`,
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        height: "100%",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "4px 8px 18px" }}>
        <Logo pal={pal} size={18} />
      </div>
      {items.map((it) => (
        <SidebarItem
          key={it.to}
          to={it.to}
          icon={it.icon}
          label={it.label}
          active={it.match(pathname)}
          badge={it.badge}
        />
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ height: 1, background: pal.line, margin: "8px 0" }} />
      <SidebarItem
        to="/app"
        icon="user"
        label={t("Diana M.")}
        active={false}
      />
    </aside>
  );
}

import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill } from "@/components/ui/Primitives";

type Row = {
  rank: number;
  name: string;
  school: string;
  elo: number;
  w: number;
  l: number;
  streak: number;
};

function TopThree() {
  const top = [
    { rank: 2, name: "Lola R.", elo: 1980, hue: 320, h: 90 },
    { rank: 1, name: "Aziz K.", elo: 2104, hue: 20, h: 120 },
    { rank: 3, name: "Otabek S.", elo: 1955, hue: 200, h: 70 },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 18,
        marginBottom: 20,
      }}
    >
      {top.map((t) => (
        <div
          key={t.rank}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            name={t.name}
            size={t.rank === 1 ? 64 : 52}
            hue={t.hue}
            ring={t.rank === 1 ? pal.accent : "transparent"}
          />
          {t.rank === 1 && (
            <div style={{ marginTop: -6, marginBottom: 4 }}>
              <Icon name="crown" size={20} color={pal.accent} />
            </div>
          )}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginTop: t.rank === 1 ? 0 : 8,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: pal.muted,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            ELO {t.elo}
          </div>
          <div
            style={{
              width: 84,
              height: t.h,
              marginTop: 10,
              borderRadius: "12px 12px 0 0",
              background: t.rank === 1 ? pal.primary : pal.surfaceAlt,
              border: t.rank === 1 ? "none" : `1px solid ${pal.line}`,
              color: t.rank === 1 ? pal.primaryInk : pal.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {t.rank}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const t = useT();

  const rows: Row[] = [
    { rank: 1, name: "Aziz Karimov", school: "Lyceum #1, Tashkent", elo: 2104, w: 312, l: 64, streak: 8 },
    { rank: 2, name: "Lola Rashidova", school: "Westminster IUT", elo: 1980, w: 287, l: 71, streak: 4 },
    { rank: 3, name: "Otabek Saidov", school: "Presidential School", elo: 1955, w: 251, l: 80, streak: 12 },
    { rank: 4, name: "Nodira A.", school: "School #243", elo: 1902, w: 198, l: 62, streak: 2 },
    { rank: 5, name: "Jamshid T.", school: "Lyceum #1, Samarkand", elo: 1881, w: 220, l: 91, streak: 1 },
    { rank: 6, name: "Madina N.", school: "Lyceum #2", elo: 1820, w: 165, l: 64, streak: 0 },
    { rank: 7, name: "Sardor X.", school: "School #19", elo: 1802, w: 178, l: 74, streak: 3 },
    { rank: 8, name: "Dilshoda M.", school: "IB Tashkent", elo: 1781, w: 154, l: 60, streak: 5 },
  ];

  const tabs: { id: string; label: string; icon: IconName; active: boolean }[] = [
    { id: "global", label: t("Global"), icon: "globe", active: true },
    { id: "weekly", label: t("This week"), icon: "clock", active: false },
    { id: "friends", label: t("Friends"), icon: "users", active: false },
    { id: "region", label: t("Tashkent"), icon: "map", active: false },
    { id: "school", label: t("My school"), icon: "shield", active: false },
  ];

  return (
    <div>
      <div
        style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>
            {t("Battle")}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Leaderboard")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            t("Mathematics"),
            t("Physics"),
            t("Chemistry"),
            t("Biology"),
            t("Uzbek lit"),
          ].map((s, i) => (
            <Pill
              key={s}
              pal={pal}
              tone={i === 0 ? "primary" : "outline"}
            >
              {s}
            </Pill>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              borderBottom: `1px solid ${pal.line}`,
            }}
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: tab.active ? 700 : 500,
                  color: tab.active ? pal.primary : pal.muted,
                  borderBottom: `2px solid ${
                    tab.active ? pal.primary : "transparent"
                  }`,
                  marginBottom: -1,
                  cursor: "pointer",
                }}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
              </div>
            ))}
          </div>

          <TopThree />

          <Card pal={pal} pad={0}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 110px 100px 80px",
                padding: "12px 18px",
                borderBottom: `1px solid ${pal.line}`,
                fontSize: 11,
                fontWeight: 700,
                color: pal.muted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span>{t("Rank")}</span>
              <span>{t("Student")}</span>
              <span style={{ textAlign: "right" }}>ELO</span>
              <span style={{ textAlign: "right" }}>W / L</span>
              <span style={{ textAlign: "right" }}>{t("Streak")}</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.rank}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 110px 100px 80px",
                  padding: "14px 18px",
                  borderBottom:
                    i < rows.length - 1 ? `1px solid ${pal.line}` : "none",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: r.rank <= 3 ? pal.accent : pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  #{r.rank}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar name={r.name} size={32} hue={(i * 47) % 360} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: pal.muted }}>
                      {r.school}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {r.elo}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  <span style={{ color: pal.good }}>{r.w}</span>
                  <span> · </span>
                  <span style={{ color: pal.bad }}>{r.l}</span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 600,
                    color: r.streak > 0 ? pal.accent : pal.muted,
                  }}
                >
                  {r.streak > 0 ? r.streak : "—"}
                  {r.streak > 0 && (
                    <span style={{ marginLeft: 2 }}>
                      <Icon name="flame" size={12} color={pal.accent} />
                    </span>
                  )}
                </span>
              </div>
            ))}
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "4px 18px",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 110px 100px 80px",
                padding: "14px 18px",
                alignItems: "center",
                background: pal.primarySoft,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: pal.primary,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                #47
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Avatar name="Diana" size={32} hue={20} ring={pal.primary} />
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: pal.primary,
                    }}
                  >
                    {t("You")} · Diana M.
                  </div>
                  <div style={{ fontSize: 11, color: pal.muted }}>
                    Lyceum #1, Tashkent
                  </div>
                </div>
              </div>
              <span
                style={{
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 700,
                  color: pal.primary,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                1487
              </span>
              <span
                style={{
                  textAlign: "right",
                  fontSize: 12,
                  color: pal.muted,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                <span style={{ color: pal.good }}>23</span> ·{" "}
                <span style={{ color: pal.bad }}>11</span>
              </span>
              <span
                style={{
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: 600,
                  color: pal.accent,
                }}
              >
                4 <Icon name="flame" size={12} color={pal.accent} />
              </span>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card pal={pal} pad={20}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 8,
              }}
            >
              {t("Your rank")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                #47
              </span>
              <Pill pal={pal} tone="good">
                <Icon name="arrow-up" size={11} /> 5
              </Pill>
            </div>
            <div style={{ fontSize: 12, color: pal.muted }}>
              of 8,412 students in Math
            </div>
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "14px 0",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>ELO</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  1487
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>
                  {t("Peak")}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  1521
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>
                  {t("Tier")}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {t("Silver")}
                </div>
              </div>
            </div>
          </Card>

          <Card pal={pal} pad={20}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t("Weekly reset in")}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              3d 14h
            </div>
            <div
              style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}
            >
              Monday 00:00 Tashkent time
            </div>
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "14px 0",
              }}
            />
            <div
              style={{ fontSize: 12, color: pal.muted, marginBottom: 8 }}
            >
              This week's prize pool
            </div>
            <Pill
              pal={pal}
              tone="accentSoft"
              icon={<Icon name="trophy" size={13} />}
            >
              Top 10 · Premium month
            </Pill>
          </Card>

          <Card
            pal={pal}
            pad={20}
            style={{ background: pal.surfaceAlt }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
              Climb faster
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginBottom: 12,
              }}
            >
              {t("You're 8 wins from Gold tier (1600)")}
            </div>
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              full
              icon={<Icon name="swords" size={14} />}
            >
              {t("Quick Match")}
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { tournaments } from "../data/tournaments";

const MAP_COLORS = {
  ERANGEL: { bg: "rgba(57,255,227,0.08)", border: "#39ffe3", label: "#39ffe3" },
  MIRAMAR: { bg: "rgba(244,196,48,0.08)", border: "#f4c430", label: "#f4c430" },
  SANHOK:  { bg: "rgba(74,220,100,0.08)", border: "#4adc64", label: "#4adc64" },
};

const STATUS_META = {
  ended:    { label: "ENDED",    color: "#8a9178",  bg: "rgba(138,145,120,0.12)", pulse: false },
  upcoming: { label: "UPCOMING", color: "#ff8a1e",  bg: "rgba(255,138,30,0.10)", pulse: false },
  active:   { label: "LIVE",     color: "#c1272d",  bg: "rgba(193,39,45,0.14)",  pulse: true  },
};

const totalPrize = tournaments.reduce((acc, t) => {
  const n = parseInt(t.prizePool.replace(/[₹,]/g, ""), 10) || 0;
  return acc + n;
}, 0);
const totalSlots = tournaments.reduce((acc, t) => acc + (t.filledSlots || 0), 0);

export default function HubPage() {
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = tournaments.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (dateQuery) {
      const q = dateQuery.toLowerCase();
      if (!t.date.toLowerCase().includes(q) && !t.isoDate.includes(q) && !t.subtitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const upcomingCount = tournaments.filter(t => t.status === "upcoming" || t.status === "active").length;
  const endedCount    = tournaments.filter(t => t.status === "ended").length;

  return (
    <div className="poster-wrapper">

      {/* ── TOP TAPE ── */}
      <div className="tape">
        <span>DS AXTERN &nbsp;•&nbsp; BGMI Tournament Hub &nbsp;•&nbsp; Organised Competitive Gaming</span>
      </div>

      {/* ── HUB HERO ── */}
      <section className="hub-hero">
        <div className="hero-glow" />
        <div className="drop-ring" style={{ width: "clamp(280px,38vw,420px)", height: "clamp(280px,38vw,420px)" }} />
        <div className="radar-sweep" style={{ width: "clamp(280px,38vw,420px)", height: "clamp(280px,38vw,420px)" }} />

        {/* Crosshairs */}
        <svg className="crosshair tl" width="46" height="46" viewBox="0 0 46 46">
          <g stroke="#ff8a1e" strokeWidth="1.4" fill="none">
            <line x1="23" y1="0" x2="23" y2="14"/><line x1="23" y1="32" x2="23" y2="46"/>
            <line x1="0" y1="23" x2="14" y2="23"/><line x1="32" y1="23" x2="46" y2="23"/>
            <circle cx="23" cy="23" r="9"/>
          </g>
        </svg>
        <svg className="crosshair br" width="46" height="46" viewBox="0 0 46 46">
          <g stroke="#ff8a1e" strokeWidth="1.4" fill="none">
            <line x1="23" y1="0" x2="23" y2="14"/><line x1="23" y1="32" x2="23" y2="46"/>
            <line x1="0" y1="23" x2="14" y2="23"/><line x1="32" y1="23" x2="46" y2="23"/>
            <circle cx="23" cy="23" r="9"/>
          </g>
        </svg>

        <div className="hub-hero-content" style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
          {/* Badge */}
          <div className="badge-row" style={{ marginBottom: "10px" }}>
            <div className="badge">
              <span style={{ fontSize: "11px", letterSpacing: "1px", textAlign: "center", lineHeight: "1.1" }}>DS<br />AXTERN</span>
            </div>
          </div>

          <div className="eyebrow">Official Competitive BGMI Platform</div>

          <div className="brand" style={{ fontSize: "clamp(36px,8vw,72px)", lineHeight: 1 }}>
            BGMI <span className="hl">HUB</span>
          </div>
          <div className="subline" style={{ fontSize: "clamp(14px,3vw,20px)", letterSpacing: "4px" }}>
            Tournament <em>Portal</em>
          </div>
          <div className="tagline" style={{ maxWidth: "520px", margin: "10px auto 0" }}>
            Browse all tournaments — upcoming battles, live lobbies, and past results. Click any card to register or view details.
          </div>

          {/* Platform Stats */}
          <div className="hub-stats">
            <div className="hub-stat">
              <div className="hub-stat-val">{tournaments.length}</div>
              <div className="hub-stat-lbl">Tournaments</div>
            </div>
            <div className="hub-stat-sep" />
            <div className="hub-stat">
              <div className="hub-stat-val">{upcomingCount}</div>
              <div className="hub-stat-lbl">Upcoming</div>
            </div>
            <div className="hub-stat-sep" />
            <div className="hub-stat">
              <div className="hub-stat-val">{totalSlots}+</div>
              <div className="hub-stat-lbl">Teams Competed</div>
            </div>
            <div className="hub-stat-sep" />
            <div className="hub-stat">
              <div className="hub-stat-val">₹{totalPrize.toLocaleString("en-IN")}</div>
              <div className="hub-stat-lbl">Prize Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="filter-bar-wrap">
        <div className="filter-bar">
          <div className="filter-pills">
            {[
              { key: "all",      label: `ALL (${tournaments.length})` },
              { key: "upcoming", label: `UPCOMING (${upcomingCount})` },
              { key: "ended",    label: `ENDED (${endedCount})` },
            ].map((f) => (
              <button
                key={f.key}
                className={`filter-pill${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            className="filter-search"
            type="text"
            placeholder="Search date or map…"
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            aria-label="Filter tournaments by date"
          />
        </div>
      </div>

      {/* ── TOURNAMENT CARDS GRID ── */}
      <div className="t-section">
        {filtered.length === 0 ? (
          <div className="t-empty">No tournaments match your filter.</div>
        ) : (
          <div className="t-grid">
            {filtered.map((t) => {
              const sm = STATUS_META[t.status] || STATUS_META.upcoming;
              const mc = MAP_COLORS[t.map] || { bg: "rgba(255,138,30,0.08)", border: "#ff8a1e", label: "#ff8a1e" };
              const fill = t.slots > 0 ? Math.round((t.filledSlots / t.slots) * 100) : 0;
              const isUpcoming = t.status === "upcoming" || t.status === "active";

              return (
                <Link href={`/tournament/${t.id}`} key={t.id} className="t-card" style={{ textDecoration: "none" }}>
                  {/* Card Header */}
                  <div className="t-card-head">
                    <div className="t-map-badge" style={{ color: mc.label, background: mc.bg, border: `1px solid ${mc.border}` }}>
                      {t.map}
                    </div>
                    <div className="t-status-badge" style={{ color: sm.color, background: sm.bg }}>
                      {sm.pulse && <span className="status-dot" style={{ background: sm.color }} />}
                      {sm.label}
                    </div>
                  </div>

                  {/* Date Strip */}
                  <div className="t-date">{t.date}</div>

                  {/* Title */}
                  <div className="t-title">{t.title}</div>
                  <div className="t-subtitle">{t.subtitle}</div>

                  {/* Key Stats Row */}
                  <div className="t-stats-row">
                    <div className="t-stat">
                      <div className="t-stat-k">MODE</div>
                      <div className="t-stat-v">{t.mode}</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-k">ENTRY</div>
                      <div className="t-stat-v">{t.entryFee}</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-k">PRIZE</div>
                      <div className="t-stat-v" style={{ color: "#f4c430" }}>{t.prizePool}</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-k">TIME</div>
                      <div className="t-stat-v">{t.time.replace(" Onwards", "")}</div>
                    </div>
                  </div>

                  {/* Slot bar */}
                  <div className="t-slot-wrap">
                    <div className="t-slot-bar">
                      <div className="t-slot-fill" style={{ width: `${fill}%`, background: fill >= 100 ? "#c1272d" : "#ff8a1e" }} />
                    </div>
                    <div className="t-slot-text">{t.filledSlots}/{t.slots} Slots</div>
                  </div>

                  {/* Ended: Winner */}
                  {t.status === "ended" && t.winner && (
                    <div className="t-winner-row">
                      <span className="t-winner-icon">🏆</span>
                      <span className="t-winner-team">{t.winner.team}</span>
                      <span className="t-winner-meta">{t.winner.kills} kills · {t.winner.prize}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className={`t-cta ${isUpcoming ? "t-cta-primary" : "t-cta-ghost"}`}>
                    {isUpcoming ? "Register Now →" : "View Results →"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="footer" style={{ marginTop: "20px" }}>
        <span className="squads">DS AXTERN</span> &nbsp;·&nbsp; Fair Play Only &nbsp;·&nbsp; {tournaments.length} Tournaments Organised
      </div>

    </div>
  );
}

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

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── ORGANIZER / ABOUT SECTION ── */}
      <div className="content-section" id="organizer">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>About Organiser</h2>
            <div className="code">DS AXTERN FOUNDER</div>
          </div>
        </div>
        <div className="organizer-card">
          <div className="organizer-img-wrap">
            <img src="/rohit.jpg" alt="Rohit - Founder of DS AXTERN" className="organizer-img" />
          </div>
          <div className="organizer-info">
            <div className="organizer-role">Founder &amp; Esports Host</div>
            <div className="organizer-name">ROHIT YADUVANSHI</div>
            <div className="organizer-bio">
              Lead Organiser &amp; Tournament Host of DS AXTERN BGMI Tournaments. Organising daily &amp; weekly competitive scrims, custom lobbies, and prize pool events for esports teams.
            </div>
            <a
              href="https://www.instagram.com/rohit_yaduvanshi_0037?igsh=aDQxOXE4aTIyNHQ="
              target="_blank"
              rel="noopener noreferrer"
              className="insta-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @rohit_yaduvanshi_0037
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="footer" style={{ marginTop: "20px" }}>
        Made with 🔥 by <span style={{ color: "#ff8a1e" }}>Rohit</span> &nbsp;•&nbsp; <span className="squads">DS AXTERN</span> &nbsp;•&nbsp; Fair Play Only
      </div>

    </div>
  );
}

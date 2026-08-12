"use client";

import { useState, useEffect } from "react";
import { tournaments } from "../data/tournaments";
import { winners } from "../data/winners";
import { videos } from "../data/videos";

export default function Home() {
  // Config
  const sheetApiUrl = process.env.NEXT_PUBLIC_SHEET_API_URL || "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
  const isBackendConfigured = sheetApiUrl && !sheetApiUrl.includes("PASTE_YOUR");

  // State
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Form inputs
  const [teamName, setTeamName] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Uid, setP1Uid] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Uid, setP2Uid] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [utr, setUtr] = useState("");

  // Marquee items
  const marqueeItems = [
    "DS CLAN PRESENTS",
    "BGMI DUO TOURNAMENT",
    "REGISTER TODAY",
    `ENTRY ${selectedTournament.entryFee} / TEAM`,
    `PRIZE POOL ${selectedTournament.prizePool}`,
    `${selectedTournament.slots} SLOTS ONLY`,
    `${selectedTournament.map} · ${selectedTournament.matches[0]?.perspective || "TPP"}`
  ];

  // Helper to escape HTML characters
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Format Facebook Video URL to Plugin Iframe
  const getFacebookEmbedUrl = (url) => {
    if (!url) return "";
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  };

  // Load Registered Teams
  const loadTeams = async () => {
    setLoadingTeams(true);
    if (!isBackendConfigured) {
      // Mock data for demo if spreadsheet is not connected
      setTimeout(() => {
        setRegisteredTeams([
          "GHOST RECON",
          "TEAM VORTEX",
          "SOUL HUNTERS",
          "GODLIKE DUO",
          "HYDRA LOBBY",
          "IND DEVILS"
        ]);
        setLoadingTeams(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch(sheetApiUrl, { method: "GET", cache: "no-store" });
      const data = await res.json();
      const teams = Array.isArray(data.teams) ? data.teams : [];
      setRegisteredTeams(teams);
    } catch (err) {
      console.error("Could not fetch teams:", err);
      // Fallback
      setRegisteredTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  };

  // Handle Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormMsg({ text: "", type: "" });

    // Validate slots
    if (registeredTeams.length >= selectedTournament.slots) {
      setFormMsg({ text: "Sorry, this tournament lobby is already full!", type: "err" });
      return;
    }

    const payload = {
      teamName: teamName.trim(),
      p1Name: p1Name.trim(),
      p1Uid: p1Uid.trim(),
      p2Name: p2Name.trim(),
      p2Uid: p2Uid.trim(),
      whatsapp: whatsapp.trim(),
      utr: utr.trim(),
      timestamp: new Date().toISOString()
    };

    if (!isBackendConfigured) {
      setFormMsg({
        text: "Registered (Demo Mode)! Since the Google Sheet is not connected, this team is added locally.",
        type: "ok"
      });
      // Locally append to state for immediate display feedback
      setRegisteredTeams(prev => [...prev, payload.teamName]);
      resetForm();
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await fetch(sheetApiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.status === "ok") {
        setFormMsg({ text: "Registered! Your slot request has been recorded.", type: "ok" });
        resetForm();
        loadTeams();
      } else {
        throw new Error(data.message || "Unknown server response");
      }
    } catch (err) {
      console.error(err);
      setFormMsg({
        text: "Something went wrong. Please check your network or message the admin.",
        type: "err"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setTeamName("");
    setP1Name("");
    setP1Uid("");
    setP2Name("");
    setP2Uid("");
    setWhatsapp("");
    setUtr("");
  };

  // Generate Confetti Particles
  useEffect(() => {
    const colors = ["#39ffe3", "#ffcb47", "#ff3d81", "#c7d3dd"];
    const particles = [];
    for (let i = 0; i < 26; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100 + "%",
        background: colors[Math.floor(Math.random() * colors.length)],
        duration: (4 + Math.random() * 5) + "s",
        delay: (Math.random() * 6) + "s",
        opacity: 0.5 + Math.random() * 0.5,
        transform: `rotate(${Math.random() * 360}deg)`
      });
    }
    setConfettiParticles(particles);
    loadTeams();
  }, []);

  return (
    <main>
      {/* Background decorations */}
      <div className="grid-bg"></div>
      <div className="noise-vig"></div>
      <div className="scanline"></div>

      {/* Marquee Banner */}
      <div className="marquee-wrap">
        <div className="marquee">
          {/* Double map content for seamless looping */}
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="radar">
          <div className="radar-sweep"></div>
        </div>
        <div className="clan-badge">DS</div>
        <div className="eyebrow">
          DS Clan Presents <b>·</b> Mobile Battle Royale
        </div>
        <h1 className="title">
          BGMI <span className="duo">DUO</span>
          <br />
          <span className="glow">TOURNAMENT</span>
        </h1>
        <div className="subtitle">
          Tournament Day · <span className="day">{selectedTournament.date}</span>
        </div>
        <p className="tagline">{selectedTournament.tagline}</p>
        <div className="cta-row">
          <a href="#register" className="btn btn-primary">
            Register Now →
          </a>
          <a href="#rules" className="btn btn-ghost">
            Read Rules
          </a>
        </div>
        <div className="scrolldown">
          Scroll<span>▾</span>
        </div>
      </section>

      <div className="hairline"></div>

      {/* TOURNAMENTS SELECTOR / LIST SECTION */}
      <section className="container" id="tournaments">
        <div className="section-head">
          <div className="section-tag">Deployments</div>
          <div className="section-title">Tournaments Arena</div>
        </div>
        
        <div className="tournaments-grid">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className={`tournament-card ${
                t.status === "active" ? "active-card" : "upcoming-card"
              } ${selectedTournament.id === t.id ? "selected-card" : ""}`}
              style={{
                borderColor: selectedTournament.id === t.id ? "var(--cyan)" : "",
                cursor: "pointer"
              }}
              onClick={() => setSelectedTournament(t)}
            >
              <div className="eyebrow" style={{ fontSize: "12px", letterSpacing: "3px" }}>
                {t.date} · {t.time.split(" ")[0]} {t.time.split(" ")[1] || ""}
              </div>
              <h3>{t.title}</h3>
              <p style={{ color: "var(--ink-dim)", fontSize: "15px", marginBottom: "14px", lineHeight: "1.4" }}>
                {t.tagline.substring(0, 100)}...
              </p>
              <div className="meta-pill-row">
                <span className="meta-pill highlight">{t.map}</span>
                <span className="meta-pill">{t.mode}</span>
                <span className="meta-pill highlight">{t.entryFee} Entry</span>
                <span className="meta-pill">{t.prizePool} Prize Pool</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline"></div>

      {/* SELECTED TOURNAMENT BRIEF */}
      <section className="container">
        <div className="section-head">
          <div className="section-tag">Mission Brief</div>
          <div className="section-title">Tournament Info</div>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <div className="lbl">Date</div>
            <div className="val">{selectedTournament.date}</div>
          </div>
          <div className="info-card">
            <div className="lbl">Timing</div>
            <div className="val">
              {selectedTournament.time}
              <small>Onwards · Both Matches</small>
            </div>
          </div>
          <div className="info-card">
            <div className="lbl">Mode</div>
            <div className="val">{selectedTournament.mode}</div>
          </div>
          <div className="info-card">
            <div className="lbl">Map</div>
            <div className="val">{selectedTournament.map}</div>
          </div>
          <div className="info-card">
            <div className="lbl">Slots</div>
            <div className="val">
              {selectedTournament.slots} <small>Teams</small>
            </div>
          </div>
          <div className="info-card fee">
            <div className="lbl">Entry Fee</div>
            <div className="val">
              {selectedTournament.entryFee} <small>Per Team</small>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline"></div>

      {/* PRIZE POOL SECTION */}
      <section className="container">
        <div className="section-head">
          <div className="section-tag">Reward Pool</div>
          <div className="section-title">Prize Distribution</div>
        </div>

        <div className="prize-stage">
          {/* Confetti Animation Background */}
          <div className="confetti">
            {confettiParticles.map((particle) => (
              <i
                key={particle.id}
                style={{
                  left: particle.left,
                  background: particle.background,
                  animationDuration: particle.duration,
                  animationDelay: particle.delay,
                  opacity: particle.opacity,
                  transform: particle.transform
                }}
              />
            ))}
          </div>

          {/* 2nd Place */}
          <div className="podium-figure p2">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="26" r="14" fill="#0d1524" stroke="#c7d3dd" strokeWidth="2.5" />
                <path d="M50 8 L50 2 M42 6 L46 10 M58 6 L54 10" stroke="#c7d3dd" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 90 C28 60 34 44 50 44 C66 44 72 60 72 90" fill="#101a2c" stroke="#c7d3dd" strokeWidth="2.5" />
                <path d="M50 44 L50 66" stroke="#c7d3dd" strokeWidth="2.5" />
                <path d="M50 50 C36 50 28 40 24 30" stroke="#c7d3dd" strokeWidth="3" fill="none" strokeLinecap="round" />
                <g transform="translate(14,12)">
                  <path d="M0 0 h20 v10 a10 10 0 0 1 -20 0 z" fill="none" stroke="#c7d3dd" strokeWidth="2" />
                  <path d="M0 2 c-6 0 -6 10 0 10" fill="none" stroke="#c7d3dd" strokeWidth="2" />
                  <path d="M20 2 c6 0 6 10 0 10" fill="none" stroke="#c7d3dd" strokeWidth="2" />
                  <rect x="8" y="20" width="4" height="6" fill="#c7d3dd" />
                  <rect x="4" y="26" width="12" height="3" fill="#c7d3dd" />
                </g>
              </svg>
            </div>
            <div className="trophy-amt">{selectedTournament.prizes.second}</div>
            <div className="rank-badge">2nd Place</div>
            <div className="podium-bar">
              <span className="podium-num">2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="podium-figure p1">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="24" r="15" fill="#0d1524" stroke="#ffcb47" strokeWidth="3" />
                <path d="M50 6 L50 -1 M40 4 L45 9 M60 4 L55 9" stroke="#ffcb47" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M26 92 C26 58 33 42 50 42 C67 42 74 58 74 92" fill="#101a2c" stroke="#ffcb47" strokeWidth="3" />
                <path d="M50 42 L50 66" stroke="#ffcb47" strokeWidth="3" />
                <path d="M50 48 C34 48 24 36 20 24" stroke="#ffcb47" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <g transform="translate(8,6)">
                  <path d="M0 0 h24 v12 a12 12 0 0 1 -24 0 z" fill="none" stroke="#ffcb47" strokeWidth="2.5" />
                  <path d="M0 2 c-7 0 -7 12 0 12" fill="none" stroke="#ffcb47" strokeWidth="2.5" />
                  <path d="M24 2 c7 0 7 12 0 12" fill="none" stroke="#ffcb47" strokeWidth="2.5" />
                  <rect x="10" y="24" width="4" height="7" fill="#ffcb47" />
                  <rect x="5" y="31" width="14" height="3.5" fill="#ffcb47" />
                </g>
              </svg>
            </div>
            <div className="trophy-amt">{selectedTournament.prizes.first}</div>
            <div className="rank-badge">Champions</div>
            <div className="podium-bar">
              <span className="podium-num">1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="podium-figure p3">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="28" r="13" fill="#0d1524" stroke="#e2a45c" strokeWidth="2.5" />
                <path d="M50 10 L50 4 M43 8 L47 12 M57 8 L53 12" stroke="#e2a45c" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M30 88 C30 62 35 46 50 46 C65 46 70 62 70 88" fill="#101a2c" stroke="#e2a45c" strokeWidth="2.5" />
                <path d="M50 46 L50 66" stroke="#e2a45c" stroke-width="2.5" />
                <path d="M50 52 C38 52 30 42 26 32" stroke="#e2a45c" strokeWidth="3" fill="none" strokeLinecap="round" />
                <g transform="translate(16,16)">
                  <path d="M0 0 h18 v9 a9 9 0 0 1 -18 0 z" fill="none" stroke="#e2a45c" strokeWidth="2" />
                  <path d="M0 2 c-5 0 -5 9 0 9" fill="none" stroke="#e2a45c" stroke-width="2" />
                  <path d="M18 2 c5 0 5 9 0 9" fill="none" stroke="#e2a45c" stroke-width="2" />
                  <rect x="7" y="18" width="4" height="5" fill="#e2a45c" />
                  <rect x="3" y="23" width="12" height="3" fill="#e2a45c" />
                </g>
              </svg>
            </div>
            <div className="trophy-amt">{selectedTournament.prizes.third}</div>
            <div className="rank-badge">3rd Place</div>
            <div className="podium-bar">
              <span className="podium-num">3</span>
            </div>
          </div>
        </div>

        <div className="prize-total">
          Total Prize Pool <b>{selectedTournament.prizePool}</b> · Rank + Kill Points Decide the Champion
        </div>
      </section>

      <div className="hairline"></div>

      {/* POINTS SYSTEM */}
      <section className="container">
        <div className="section-head">
          <div className="section-tag">Scoring Protocol</div>
          <div className="section-title">Points System</div>
        </div>
        <div className="points-wrap">
          <table className="points">
            <thead>
              <tr>
                <th>Placement</th>
                <th>Rank Points</th>
                <th>Per Kill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="rank">#1</td>
                <td className="pts">10</td>
                <td rowSpan={4} style={{ verticalAlign: "middle", color: "var(--ink)" }}>
                  1 Point / Kill
                  <br />
                  <span style={{ fontSize: "12px", color: "var(--ink-dim)" }}>
                    (No Limit)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="rank">#2</td>
                <td className="pts">8</td>
              </tr>
              <tr>
                <td className="rank">#3</td>
                <td className="pts">6</td>
              </tr>
              <tr>
                <td className="rank">#4 – #16</td>
                <td className="pts">0</td>
              </tr>
            </tbody>
          </table>
          <div className="points-note">
            Final standings = Rank Points + Total Kill Points, added across both matches. Tie will be broken by higher total kills.
          </div>
        </div>
      </section>

      <div className="hairline"></div>

      {/* MATCH SCHEDULE */}
      <section className="container">
        <div className="section-head">
          <div className="section-tag">Deployment Schedule</div>
          <div className="section-title">Match Lineup</div>
        </div>
        <div className="match-grid">
          {selectedTournament.matches.map((match, i) => (
            <div className="match-card" key={i}>
              <div className="match-tag">{match.tag}</div>
              <h3>{match.title}</h3>
              <div className="match-meta">
                <div>
                  Time <b>{match.time}</b>
                </div>
                <div>
                  Map <b>{match.map}</b>
                </div>
                <div>
                  Perspective <b>{match.perspective}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline"></div>

      {/* RULES */}
      <section className="container" id="rules">
        <div className="section-head">
          <div className="section-tag">Read Before You Drop</div>
          <div className="section-title">Rules &amp; Regulations</div>
        </div>
        <div className="rules-list">
          <div className="rule-item">
            <p>
              <b>Squad size —</b> Strictly 2 players per team (Duo). Playing with 3+ on tag leads to disqualification.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Room details —</b> Room ID &amp; Password will be shared in the official group 10 minutes before each match. Be online early.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Reporting time —</b> Both players must join the lobby at least 15 minutes before the scheduled match time.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Map &amp; perspective —</b> Matches will be played on <b>{selectedTournament.map}, TPP</b> only.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Fair play —</b> Use of hacks, emulators, macros, or teaming with another squad results in an <b>instant ban</b> from DS Clan events.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Proof of match —</b> Submit a clear screenshot of the result screen (rank + kills) in the group right after every match.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Entry fee —</b> {selectedTournament.entryFee} per team, payable in advance to confirm your slot. <b>Non-refundable</b> once a slot is allotted.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Slots —</b> Limited to {selectedTournament.slots} teams. Slots are confirmed strictly on a first-pay-first-serve basis.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Conduct —</b> Abuse, toxicity, or disrespect toward admins/other players in the group will lead to removal without refund.
            </p>
          </div>
          <div className="rule-item">
            <p>
              <b>Final word —</b> All scoring and eligibility decisions made by DS Clan admins are final and binding.
            </p>
          </div>
        </div>
      </section>

      <div className="hairline"></div>

      {/* REGISTER / CONTACT FLOW */}
      <section className="container" id="register">
        <div className="section-head">
          <div className="section-tag">Slot Confirmation</div>
          <div className="section-title">Pay &amp; Register</div>
        </div>

        {selectedTournament.status === "active" ? (
          <div className="reg-flow">
            <div className="pay-card">
              <div className="lbl">Scan &amp; Pay</div>
              <img src="/payment-qr.jpg" alt="PhonePe payment QR code" />
              <div className="payee">ROHIT KUMAR</div>
              <div className="fee-note">Pay {selectedTournament.entryFee} · Then fill the form →</div>
            </div>

            <div className="form-card">
              <h3>Team Registration</h3>
              <form className="reg-form" onSubmit={handleRegister}>
                {!isBackendConfigured && (
                  <div style={{ background: "rgba(255, 203, 71, 0.1)", border: "1px solid var(--gold-dim)", padding: "10px", borderRadius: "4px", fontSize: "14px", color: "var(--gold)", marginBottom: "10px" }}>
                    ⚠️ <b>Developer Mode:</b> Google Apps Script URL is not set in `.env.local`. Registrations will be processed locally in memory.
                  </div>
                )}
                <div>
                  <label htmlFor="teamName">Team Name</label>
                  <input
                    type="text"
                    id="teamName"
                    required
                    maxLength={40}
                    placeholder="e.g. GHOST RECON"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <div>
                    <label htmlFor="p1Name">Player 1 IGN</label>
                    <input
                      type="text"
                      id="p1Name"
                      required
                      maxLength={30}
                      value={p1Name}
                      onChange={(e) => setP1Name(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="p1Uid">Player 1 UID</label>
                    <input
                      type="text"
                      id="p1Uid"
                      required
                      maxLength={20}
                      inputMode="numeric"
                      value={p1Uid}
                      onChange={(e) => setP1Uid(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field-row">
                  <div>
                    <label htmlFor="p2Name">Player 2 IGN</label>
                    <input
                      type="text"
                      id="p2Name"
                      required
                      maxLength={30}
                      value={p2Name}
                      onChange={(e) => setP2Name(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="p2Uid">Player 2 UID</label>
                    <input
                      type="text"
                      id="p2Uid"
                      required
                      maxLength={20}
                      inputMode="numeric"
                      value={p2Uid}
                      onChange={(e) => setP2Uid(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="whatsapp">WhatsApp Number</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    required
                    maxLength={15}
                    inputMode="numeric"
                    placeholder="10-digit number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="utr">Payment UTR / Transaction ID</label>
                  <input
                    type="text"
                    id="utr"
                    required
                    maxLength={30}
                    placeholder="From PhonePe payment screen"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitLoading || registeredTeams.length >= selectedTournament.slots}
                >
                  {submitLoading ? "Submitting…" : "Confirm Registration"}
                </button>
                <div className={`form-msg ${formMsg.type === "ok" ? "ok" : formMsg.type === "err" ? "err" : ""}`}>
                  {formMsg.text}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="reg-panel">
            <h2>Registration Not Active</h2>
            <p>This tournament is upcoming. Registration will unlock closer to the deployment date. Check back soon!</p>
            <div className="slots-left" style={{ marginTop: 0 }}>Stay Tuned · DS CLAN Admin</div>
          </div>
        )}
        <div className="slots-left" style={{ textAlign: "center" }}>
          Only <b>{selectedTournament.slots} Team Slots</b> Available · First-Pay-First-Serve
        </div>
      </section>

      <div className="hairline"></div>

      {/* CONFIRMED LOBBY (REGISTERED TEAMS LIST) */}
      <section className="container" id="teams">
        <div className="section-head">
          <div className="section-tag">Confirmed Lobby</div>
          <div className="section-title">Registered Teams</div>
        </div>
        <div className="teams-wrap">
          <div className="teams-list">
            {loadingTeams ? (
              <div className="teams-loading">Loading teams…</div>
            ) : registeredTeams.length === 0 ? (
              <div className="teams-empty">No teams registered yet. Be the first to lock a slot!</div>
            ) : (
              registeredTeams.map((name, i) => (
                <div className="team-row" key={i}>
                  <span className="team-slot">#{String(i + 1).padStart(2, "0")}</span>
                  <span className="team-name">{escapeHtml(name)}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="teams-count">
          <b>{registeredTeams.length}</b> / {selectedTournament.slots} Slots Filled
        </div>
      </section>

      <div className="hairline"></div>

      {/* WINNERS CONGRATULATIONS SHOWCASE */}
      <section className="container" id="winners">
        <div className="section-head">
          <div className="section-tag">Hall of Fame</div>
          <div className="section-title">Tournament Champions</div>
        </div>

        <div className="winners-grid">
          {winners.map((winner) => (
            <div className="winner-card" key={winner.id}>
              {/* Crown Icon */}
              <svg className="winner-crown" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 4l3 3 7-5 7 5 3-3v14H2V4zm2 12h16v-2H4v2zm0-4h16V9.82l-2 2-6-4.29-6 4.29-2-2V12z" />
              </svg>
              <div className="t-name">{winner.tournamentName}</div>
              <div className="w-team">🏆 {winner.winningTeam}</div>
              <div className="w-players">
                {winner.players.map((p, idx) => (
                  <span key={idx}>{p}</span>
                ))}
              </div>
              <p className="congrats-txt">“ {winner.congratsMessage} ”</p>
              <div className="w-meta">
                <span>Date: <b>{winner.date}</b></span>
                <span>Kills: <b>{winner.kills}</b></span>
                <span>Prize: <b style={{ color: "var(--gold)" }}>{winner.prize}</b></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline"></div>

      {/* FACEBOOK VIDEOS SECTION */}
      <section className="container" id="videos">
        <div className="section-head">
          <div className="section-tag">Media Highlights</div>
          <div className="section-title">Clutches &amp; Streams</div>
        </div>

        <div className="video-grid">
          {videos.map((video) => (
            <div className="video-card" key={video.id}>
              <div className="video-frame-container">
                <iframe
                  src={getFacebookEmbedUrl(video.url)}
                  width="560"
                  height="314"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <span className="clan-name">DS CLAN</span> · Mobile Battle Royale Division
        </div>
        <div style={{ marginTop: "6px", opacity: 0.7 }}>
          BGMI Duo Tournament Portal · {selectedTournament.date}
        </div>
      </footer>
    </main>
  );
}

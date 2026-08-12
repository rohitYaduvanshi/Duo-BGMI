"use client";

import { useState, useEffect, useRef } from "react";
import { tournaments } from "../data/tournaments";
import { winners } from "../data/winners";
import { videos } from "../data/videos";

export default function Home() {
  // Config — fallback URL used if env not set
  const sheetApiUrl =
    process.env.NEXT_PUBLIC_SHEET_API_URL ||
    "https://script.google.com/macros/s/AKfycbz0fAscS53oJBZVF9oTX3w35vzpjwERBVHOz853iU4C5b5Kl6OOOJC1hlr_JyM0NHm6/exec";
  const isBackendConfigured =
    sheetApiUrl && !sheetApiUrl.includes("PASTE_YOUR");

  // Tournament selection
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);

  // Teams list
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Form state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });

  // Form inputs
  const [teamName, setTeamName] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Uid, setP1Uid] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Uid, setP2Uid] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [utr, setUtr] = useState("");

  // Screenshot upload
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [screenshotMime, setScreenshotMime] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Confetti
  const [confettiParticles, setConfettiParticles] = useState([]);

  // ── Confetti generation (client only) ──────────────────────────────
  useEffect(() => {
    const colors = [
      "#f8c300","#ff8c00","#ff4040","#39ffe3","#ffffff",
      "#ff8c00","#f8c300","#ff7a00","#ffffff",
    ];
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      background: colors[Math.floor(Math.random() * colors.length)],
      duration: `${2.5 + Math.random() * 3}s`,
      delay: `${Math.random() * 4}s`,
      opacity: 0.5 + Math.random() * 0.5,
      transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
    }));
    setConfettiParticles(particles);
  }, []);

  // ── Fetch registered teams ─────────────────────────────────────────
  useEffect(() => {
    if (!isBackendConfigured) { setLoadingTeams(false); return; }
    fetch(`${sheetApiUrl}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.teams) setRegisteredTeams(data.teams);
      })
      .catch(() => {})
      .finally(() => setLoadingTeams(false));
  }, [sheetApiUrl, isBackendConfigured]);

  // ── Screenshot file handler ────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormMsg({ text: "Screenshot must be under 5 MB.", type: "error" });
      return;
    }
    setScreenshotFile(file);
    setScreenshotMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target.result);
      setScreenshotBase64(e.target.result); // full data-url (base64)
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview("");
    setScreenshotBase64("");
    setScreenshotMime("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Form submission ────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitLoading) return;

    const slotsLeft = selectedTournament.slots - registeredTeams.length;
    if (slotsLeft <= 0) {
      setFormMsg({ text: "All slots are filled! No more registrations.", type: "error" });
      return;
    }

    setSubmitLoading(true);
    setFormMsg({ text: "", type: "" });

    const payload = {
      teamName: teamName.trim(),
      p1Name: p1Name.trim(),
      p1Uid: p1Uid.trim(),
      p2Name: p2Name.trim(),
      p2Uid: p2Uid.trim(),
      whatsapp: whatsapp.trim(),
      utr: utr.trim(),
      screenshotBase64: screenshotBase64,
      screenshotMime: screenshotMime,
      timestamp: new Date().toISOString(),
      tournament: selectedTournament.id || selectedTournament.name,
    };

    if (!isBackendConfigured) {
      // Demo mode — store locally
      await new Promise((r) => setTimeout(r, 800));
      setRegisteredTeams((prev) => [...prev, teamName.trim()]);
      setFormMsg({ text: `✅ ${teamName.trim()} registered! (Demo Mode)`, type: "ok" });
      resetForm();
      setSubmitLoading(false);
      return;
    }

    try {
      const res = await fetch(sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // no-cors means opaque response — assume ok
      setRegisteredTeams((prev) => [...prev, teamName.trim()]);
      setFormMsg({ text: `✅ ${teamName.trim()} registered successfully!`, type: "ok" });
      resetForm();
    } catch {
      setFormMsg({ text: "⚠️ Error submitting. Please try again.", type: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setTeamName(""); setP1Name(""); setP1Uid("");
    setP2Name(""); setP2Uid(""); setWhatsapp(""); setUtr("");
    removeScreenshot();
  };

  // ── Facebook video embed helper ────────────────────────────────────
  const getFacebookEmbedUrl = (url) => {
    if (!url) return null;
    try {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
    } catch { return null; }
  };

  const slotsLeft = selectedTournament.slots - registeredTeams.length;

  // ── Hazard banner items ────────────────────────────────────────────
  const hazardItems = Array.from({ length: 8 }, (_, i) => (
    <span key={i}>DS CLAN PRESENTS</span>
  ));

  // ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Background textures */}
      <div className="bg-grid" />
      <div className="bg-radial" />

      {/* ── HAZARD STRIPE BANNER ── */}
      <div className="hazard-banner" aria-hidden="true">
        <div className="hazard-text">
          {hazardItems}
          <span>DS CLAN PRESENTS</span><span>DUO TOURNAMENT</span>
          <span>BGMI</span><span>DS CLAN PRESENTS</span>
          <span>DUO TOURNAMENT</span><span>BGMI</span>
          <span>DS CLAN PRESENTS</span><span>DUO TOURNAMENT</span>
          <span>BGMI</span>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="hero" id="home">
        <div className="ds-badge">DS</div>

        <p className="hero-eyebrow">// DS CLAN MOBILE BATTLE ROYALE //</p>

        <h1 className="hero-title">
          BGMI <span className="highlight">DUO</span>
        </h1>
        <p className="hero-subtitle">
          TOURNAMENT <span className="day">DAY</span>
        </p>

        <p className="hero-tagline">
          Drop in with your duo. 2 intense matches, one map — and one squad
          walks away champions. Limited slots. Book yours before the lobby fills.
        </p>

        <div className="cta-row">
          <a href="#register" className="btn btn-primary">Register Now →</a>
          <a href="#rules" className="btn btn-ghost">Read Rules</a>
        </div>

        <div className="scrolldown">Scroll <span>▾</span></div>
      </section>

      <div className="hairline" />

      {/* ── TOURNAMENTS SELECTOR ── */}
      <section className="container" id="tournaments">
        <div className="section-head">
          <div>
            <div className="section-label">Active Deployments</div>
            <div className="section-title">Tournaments Arena</div>
          </div>
        </div>

        <div className="tournaments-grid">
          {tournaments.map((t) => (
            <div
              key={t.id || t.name}
              className={`tournament-card ${
                selectedTournament.name === t.name ? "active-selected" : ""
              }`}
              onClick={() => setSelectedTournament(t)}
            >
              <div className={`tc-status ${t.status}`}>{t.status}</div>
              <p style={{ fontFamily: "'Teko', sans-serif", letterSpacing: "3px", fontSize: "12px", color: "var(--ink-dim)", textTransform: "uppercase" }}>
                {t.date} · {t.time}
              </p>
              <h3>{t.name}</h3>
              <p style={{ color: "var(--ink-dim)", fontSize: "15px", marginBottom: "14px", lineHeight: "1.4" }}>
                {t.description?.slice(0, 90)}...
              </p>
              <div className="meta-pill-row">
                <span className="meta-pill active-pill">{t.map}</span>
                <span className="meta-pill">{t.mode}</span>
                <span className="meta-pill active-pill">{t.entryFee} Entry</span>
                <span className="meta-pill">{t.prizePool} Prize Pool</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* ── TOURNAMENT INFO CARDS ── */}
      <section className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Mission Brief</div>
            <div className="section-title">Tournament Info</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="lbl">Date</div>
            <div className="val">{selectedTournament.date}</div>
          </div>
          <div className="info-card">
            <div className="lbl">Timings</div>
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
            <div className="lbl">Max Teams</div>
            <div className="val white-val">
              {selectedTournament.slots} <small>Teams</small>
            </div>
          </div>
          <div className="info-card">
            <div className="lbl">Entry Fee</div>
            <div className="val">
              {selectedTournament.entryFee} <small>Per Team</small>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ── PRIZE POOL ── */}
      <section className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Reward Pool</div>
            <div className="section-title">Prize Distribution</div>
          </div>
        </div>

        <div className="prize-stage">
          <div className="confetti">
            {confettiParticles.map((p) => (
              <i
                key={p.id}
                style={{
                  left: p.left,
                  background: p.background,
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                  opacity: p.opacity,
                  transform: p.transform,
                }}
              />
            ))}
          </div>

          {/* 2nd Place */}
          <div className="podium-figure p2">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="26" r="14" fill="#141910" stroke="#c7d3dd" strokeWidth="2.5" />
                <path d="M50 8 L50 2 M42 6 L46 10 M58 6 L54 10" stroke="#c7d3dd" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 90 C28 60 34 44 50 44 C66 44 72 60 72 90" fill="#1c2215" stroke="#c7d3dd" strokeWidth="2.5" />
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
            <div className="trophy-amt" style={{ color: "#c7d3dd" }}>{selectedTournament.prizes?.second}</div>
            <div className="rank-badge">2nd Place</div>
            <div className="podium-bar"><span className="podium-num">2</span></div>
          </div>

          {/* 1st Place */}
          <div className="podium-figure p1">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="24" r="15" fill="#141910" stroke="#f8c300" strokeWidth="3" />
                <path d="M50 6 L50 -1 M40 4 L45 9 M60 4 L55 9" stroke="#f8c300" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M26 92 C26 58 33 42 50 42 C67 42 74 58 74 92" fill="#1c2215" stroke="#f8c300" strokeWidth="3" />
                <path d="M50 42 L50 66" stroke="#f8c300" strokeWidth="3" />
                <path d="M50 48 C34 48 24 36 20 24" stroke="#f8c300" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <g transform="translate(8,6)">
                  <path d="M0 0 h24 v12 a12 12 0 0 1 -24 0 z" fill="none" stroke="#f8c300" strokeWidth="2.5" />
                  <path d="M0 2 c-7 0 -7 12 0 12" fill="none" stroke="#f8c300" strokeWidth="2.5" />
                  <path d="M24 2 c7 0 7 12 0 12" fill="none" stroke="#f8c300" strokeWidth="2.5" />
                  <rect x="10" y="24" width="4" height="7" fill="#f8c300" />
                  <rect x="5" y="31" width="14" height="3.5" fill="#f8c300" />
                </g>
              </svg>
            </div>
            <div className="trophy-amt">{selectedTournament.prizes?.first}</div>
            <div className="rank-badge">Champions</div>
            <div className="podium-bar"><span className="podium-num">1</span></div>
          </div>

          {/* 3rd Place */}
          <div className="podium-figure p3">
            <div className="player">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="28" r="13" fill="#141910" stroke="#e2a45c" strokeWidth="2.5" />
                <path d="M50 10 L50 4 M43 8 L47 12 M57 8 L53 12" stroke="#e2a45c" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M30 88 C30 62 35 46 50 46 C65 46 70 62 70 88" fill="#1c2215" stroke="#e2a45c" strokeWidth="2.5" />
                <path d="M50 46 L50 66" stroke="#e2a45c" strokeWidth="2.5" />
                <path d="M50 52 C38 52 30 42 26 32" stroke="#e2a45c" strokeWidth="3" fill="none" strokeLinecap="round" />
                <g transform="translate(16,16)">
                  <path d="M0 0 h18 v9 a9 9 0 0 1 -18 0 z" fill="none" stroke="#e2a45c" strokeWidth="2" />
                  <path d="M0 2 c-5 0 -5 9 0 9" fill="none" stroke="#e2a45c" strokeWidth="2" />
                  <path d="M18 2 c5 0 5 9 0 9" fill="none" stroke="#e2a45c" strokeWidth="2" />
                  <rect x="7" y="18" width="4" height="5" fill="#e2a45c" />
                  <rect x="3" y="23" width="12" height="3" fill="#e2a45c" />
                </g>
              </svg>
            </div>
            <div className="trophy-amt" style={{ color: "#e2a45c" }}>{selectedTournament.prizes?.third}</div>
            <div className="rank-badge">3rd Place</div>
            <div className="podium-bar"><span className="podium-num">3</span></div>
          </div>
        </div>

        <div className="prize-total">
          Total Prize Pool <b>{selectedTournament.prizePool}</b> · Rank + Kill Points Decide the Champion
        </div>
      </section>

      <div className="hairline" />

      {/* ── POINTS SYSTEM ── */}
      <section className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Scoring Protocol</div>
            <div className="section-title">Points System</div>
          </div>
          <div className="section-subtitle-right">Rank + Kill</div>
        </div>

        <div className="points-panel">
          <div className="points-row">
            <div className="rank-num">#1</div>
            <div className="rank-desc">Winner Winner Chicken Dinner</div>
            <div className="rank-pts">10 PTS</div>
          </div>
          <div className="points-row">
            <div className="rank-num">#2</div>
            <div className="rank-desc">Runner-Up</div>
            <div className="rank-pts">8 PTS</div>
          </div>
          <div className="points-row">
            <div className="rank-num">#3</div>
            <div className="rank-desc">Third Place</div>
            <div className="rank-pts">6 PTS</div>
          </div>
          <div className="points-row">
            <div className="rank-num" style={{ color: "var(--ink-dim)" }}>–</div>
            <div className="rank-desc">Per Kill</div>
            <div className="rank-pts">1 PT</div>
          </div>
        </div>

        <p style={{ marginTop: "14px", fontSize: "14px", color: "var(--ink-dim)", fontFamily: "'Rajdhani', sans-serif", textAlign: "center" }}>
          Final standings = Rank Points + Total Kill Points across both matches. Tie broken by higher total kills.
        </p>
      </section>

      <div className="hairline" />

      {/* ── MATCH SCHEDULE ── */}
      <section className="container">
        <div className="section-head">
          <div>
            <div className="section-label">Deployment Schedule</div>
            <div className="section-title">Match Lineup</div>
          </div>
        </div>

        <div className="match-grid">
          <div className="match-card">
            <div className="match-tag">Match 01</div>
            <h3>First Drop</h3>
            <div className="match-meta">
              <div><span>Time</span><b>9:30 AM</b></div>
              <div><span>Map</span><b>{selectedTournament.map}</b></div>
              <div><span>Perspective</span><b>TPP</b></div>
            </div>
          </div>
          <div className="match-card">
            <div className="match-tag">Match 02</div>
            <h3>Final Circle</h3>
            <div className="match-meta">
              <div><span>Time</span><b>6:30 PM</b></div>
              <div><span>Map</span><b>{selectedTournament.map}</b></div>
              <div><span>Perspective</span><b>TPP</b></div>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ── RULES OF ENGAGEMENT ── */}
      <section className="container" id="rules">
        <div className="section-head">
          <div>
            <div className="section-label">Read Before You Drop</div>
            <div className="section-title">Rules of Engagement</div>
          </div>
          <div className="section-subtitle-right">Read Before Drop</div>
        </div>

        <div className="rules-panel">
          {[
            { b: "Fair play —", t: "Hacks, cheats, mod menus, GFX injectors or any illegal third-party tool are strictly banned — instant disqualification, no refund." },
            { b: "Squad size —", t: `Team size is fixed at 2 players (Duo). No substitutes allowed once a match begins.` },
            { b: "Two matches —", t: `Match 1 at 9:30 AM, Match 2 at 6:30 PM. Be online 10 minutes before each match.` },
            { b: "Room ID —", t: "Room ID & password will be shared before every match — miss the timing and you miss the slot." },
            { b: "Teaming —", t: "Teaming up with rival squads during any match is strictly banned and leads to disqualification." },
            { b: "Proof of match —", t: "Submit a screenshot of the final result screen after each match for score verification." },
            { b: "Final standings —", t: "Final standings are decided by combined points from both matches (placement points + kill points)." },
            { b: "Entry fee —", t: `Entry fee of ${selectedTournament.entryFee} per team is non-refundable once your slot is confirmed.` },
            { b: "Slots —", t: `Only the first ${selectedTournament.slots} teams to complete payment get a confirmed slot.` },
            { b: "Final word —", t: "The organiser's decision on any dispute or rule violation is final." },
          ].map((rule, i) => (
            <div className="rule-row" key={i}>
              <div className="rule-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="rule-text"><b>{rule.b}</b> {rule.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ORANGE CTA STRIP ── */}
      <div style={{ padding: "0 20px 0" }}>
        <div className="cta-strip">
          <div className="strip-left">
            <div className="strip-title">Slots Filling Fast</div>
            <div className="strip-sub">Pay {selectedTournament.entryFee} to lock your squad&apos;s spot</div>
          </div>
          <div className="strip-right">
            <div className="contact-label">Contact / Register</div>
            <a href="tel:+919380102402" className="contact-num">+91 93801 02402</a>
          </div>
        </div>
      </div>

      <div className="hairline" style={{ marginTop: "0" }} />

      {/* ── PAY & REGISTER ── */}
      <section className="container" id="register">
        <div className="section-head">
          <div>
            <div className="section-label">Slot Confirmation</div>
            <div className="section-title">Pay &amp; Register</div>
          </div>
        </div>

        <div className="reg-flow">
          {/* QR Card */}
          <div className="pay-card">
            <div className="pay-lbl">Scan &amp; Pay</div>
            <img src="/payment-qr.jpg" alt="PhonePe QR Code" />
            <div className="payee-name">ROHIT KUMAR</div>
            <div className="pay-instruction">Pay {selectedTournament.entryFee} · Then fill the form →</div>
          </div>

          {/* Registration Form */}
          <div className="form-card">
            <h3>Team Registration</h3>

            {!isBackendConfigured && (
              <div style={{ background: "rgba(255,140,0,0.08)", border: "1px solid rgba(255,140,0,0.3)", padding: "10px 14px", borderRadius: "3px", fontSize: "13px", color: "var(--orange)", marginBottom: "14px", fontFamily: "'Rajdhani', sans-serif" }}>
                ⚠️ <b>Demo Mode:</b> Google Apps Script URL not set. Registrations saved locally.
              </div>
            )}

            <form className="reg-form" onSubmit={handleRegister}>
              {/* Team Name */}
              <div>
                <label className="form-label" htmlFor="teamName">Team Name</label>
                <input
                  className="form-input"
                  id="teamName"
                  type="text"
                  required
                  maxLength={40}
                  placeholder="e.g. GHOST RECON"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              {/* Player 1 */}
              <div className="field-row">
                <div>
                  <label className="form-label" htmlFor="p1Name">Player 1 IGN</label>
                  <input className="form-input" id="p1Name" type="text" required maxLength={30} value={p1Name} onChange={(e) => setP1Name(e.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="p1Uid">Player 1 UID</label>
                  <input className="form-input" id="p1Uid" type="text" required maxLength={20} inputMode="numeric" value={p1Uid} onChange={(e) => setP1Uid(e.target.value)} />
                </div>
              </div>

              {/* Player 2 */}
              <div className="field-row">
                <div>
                  <label className="form-label" htmlFor="p2Name">Player 2 IGN</label>
                  <input className="form-input" id="p2Name" type="text" required maxLength={30} value={p2Name} onChange={(e) => setP2Name(e.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="p2Uid">Player 2 UID</label>
                  <input className="form-input" id="p2Uid" type="text" required maxLength={20} inputMode="numeric" value={p2Uid} onChange={(e) => setP2Uid(e.target.value)} />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="form-label" htmlFor="whatsapp">WhatsApp Number</label>
                <input className="form-input" id="whatsapp" type="tel" required maxLength={15} inputMode="numeric" placeholder="10-digit number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>

              {/* UTR */}
              <div>
                <label className="form-label" htmlFor="utr">Payment UTR / Transaction ID</label>
                <input className="form-input" id="utr" type="text" required maxLength={30} placeholder="From PhonePe payment screen" value={utr} onChange={(e) => setUtr(e.target.value)} />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="form-label">Payment Screenshot</label>
                {screenshotPreview ? (
                  <div style={{ textAlign: "center" }}>
                    <div className="screenshot-preview">
                      <img src={screenshotPreview} alt="Screenshot preview" />
                      <button type="button" className="remove-btn" onClick={removeScreenshot} aria-label="Remove screenshot">✕</button>
                    </div>
                    <p style={{ marginTop: "8px", fontSize: "12px", color: "var(--success)", fontFamily: "'Teko', sans-serif", letterSpacing: "2px" }}>
                      ✓ SCREENSHOT ATTACHED
                    </p>
                  </div>
                ) : (
                  <div
                    className={`upload-zone${dragOver ? " drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      aria-label="Upload payment screenshot"
                    />
                    <span className="upload-icon">📷</span>
                    <div className="upload-text">Upload Screenshot</div>
                    <div className="upload-subtext">Drag & drop or click to browse · JPG, PNG (max 5MB)</div>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={submitLoading}>
                {submitLoading ? "SUBMITTING..." : "Confirm Registration"}
              </button>

              {formMsg.text && (
                <div className={formMsg.type === "ok" ? "form-msg-ok" : "form-msg-err"}>
                  {formMsg.text}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="slots-note">
          Only <b>{slotsLeft > 0 ? slotsLeft : 0} Team Slots</b> Available · First-Pay-First-Serve
        </div>
      </section>

      <div className="hairline" />

      {/* ── REGISTERED TEAMS ── */}
      <section className="container" id="teams">
        <div className="section-head">
          <div>
            <div className="section-label">Confirmed Lobby</div>
            <div className="section-title">Registered Teams</div>
          </div>
        </div>

        <div className="teams-panel">
          {loadingTeams ? (
            <div className="teams-loading">Loading teams…</div>
          ) : registeredTeams.length === 0 ? (
            <div className="teams-empty">No teams registered yet — be the first!</div>
          ) : (
            registeredTeams.map((name, i) => (
              <div className="team-row" key={i}>
                <div className="team-slot">#{String(i + 1).padStart(2, "0")}</div>
                <div className="team-name">{name}</div>
              </div>
            ))
          )}
        </div>

        <div className="teams-count">
          <b>{registeredTeams.length}</b> / {selectedTournament.slots} Slots Filled
        </div>
      </section>

      <div className="hairline" />

      {/* ── WINNERS HALL ── */}
      <section className="container" id="winners">
        <div className="section-head">
          <div>
            <div className="section-label">Hall of Fame</div>
            <div className="section-title">Tournament Champions</div>
          </div>
        </div>

        <div className="winners-grid">
          {winners.map((w, i) => (
            <div className="winner-card" key={i}>
              <svg className="winner-crown" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 4l3 3 7-5 7 5 3-3v14H2V4zm2 12h16v-2H4v2zm0-4h16V9.82l-2 2-6-4.29-6 4.29-2-2V12z" />
              </svg>
              <div className="winner-t-name">{w.tournament}</div>
              <div className="winner-team">🏆 {w.team}</div>
              <div className="winner-players">
                {w.players.map((p) => <span key={p}>{p}</span>)}
              </div>
              <p className="winner-congrats">&ldquo; {w.quote} &rdquo;</p>
              <div className="winner-meta">
                <span>Date: <b>{w.date}</b></span>
                <span>Kills: <b>{w.kills}</b></span>
                <span>Prize: <b style={{ color: "var(--yellow)" }}>{w.prize}</b></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FACEBOOK VIDEOS ── */}
      {videos.length > 0 && (
        <>
          <div className="hairline" />
          <section className="container" id="videos">
            <div className="section-head">
              <div>
                <div className="section-label">Media Highlights</div>
                <div className="section-title">Clutches &amp; Streams</div>
              </div>
            </div>

            <div className="video-grid">
              {videos.map((v, i) => {
                const embedUrl = getFacebookEmbedUrl(v.url);
                if (!embedUrl) return null;
                return (
                  <div className="video-card" key={i}>
                    <div className="video-frame-container">
                      <iframe
                        src={embedUrl}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title={v.title}
                      />
                    </div>
                    <div className="video-info">
                      <h4>{v.title}</h4>
                      <p>{v.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer>
        <div>
          <span className="clan-name">DS CLAN</span> · Mobile Battle Royale Division
        </div>
        <div style={{ marginTop: "6px", opacity: 0.5 }}>
          Only {selectedTournament.slots} Squads Get In · Fair Play Only · DS Clan
        </div>
      </footer>
    </>
  );
}

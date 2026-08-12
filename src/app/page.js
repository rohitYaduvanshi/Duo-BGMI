"use client";

import { useState, useEffect, useRef } from "react";
import { tournaments } from "../data/tournaments";
import { winners } from "../data/winners";
import { videos } from "../data/videos";

export default function Home() {
  const sheetApiUrl =
    process.env.NEXT_PUBLIC_SHEET_API_URL ||
    "https://script.google.com/macros/s/AKfycbz0fAscS53oJBZVF9oTX3w35vzpjwERBVHOz853iU4C5b5Kl6OOOJC1hlr_JyM0NHm6/exec";
  const isBackendConfigured = sheetApiUrl && !sheetApiUrl.includes("PASTE_YOUR");

  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [confettiItems, setConfettiItems] = useState([]);

  const [teamName, setTeamName] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Uid, setP1Uid] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Uid, setP2Uid] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [utr, setUtr] = useState("");

  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [screenshotMime, setScreenshotMime] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Confetti (client-only)
  useEffect(() => {
    const colors = ["#f4c430","#ff8a1e","#c1272d","#eae6d6","#ff8a1e","#f4c430"];
    setConfettiItems(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        bg: colors[Math.floor(Math.random() * colors.length)],
        dur: `${2.8 + Math.random() * 3}s`,
        delay: `${Math.random() * 4}s`,
        opacity: 0.5 + Math.random() * 0.5,
        rot: `rotate(${Math.random() * 360}deg)`,
      }))
    );
  }, []);

  // Fetch teams via API proxy
  useEffect(() => {
    fetch(`/api/teams?t=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => { if (d.teams) setRegisteredTeams(d.teams); })
      .catch(() => {})
      .finally(() => setLoadingTeams(false));
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormMsg({ text: "Screenshot must be under 5 MB.", type: "error" });
      return;
    }
    setScreenshotMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target.result);
      setScreenshotBase64(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    setScreenshotPreview(""); setScreenshotBase64(""); setScreenshotMime("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitLoading) return;
    setSubmitLoading(true);
    setFormMsg({ text: "", type: "" });

    const payload = {
      teamName: teamName.trim(), p1Name: p1Name.trim(), p1Uid: p1Uid.trim(),
      p2Name: p2Name.trim(), p2Uid: p2Uid.trim(), whatsapp: whatsapp.trim(),
      utr: utr.trim(), screenshotBase64, screenshotMime,
      timestamp: new Date().toISOString(),
      tournament: selectedTournament.id || selectedTournament.name,
    };

    if (!isBackendConfigured) {
      await new Promise((r) => setTimeout(r, 700));
      setRegisteredTeams((prev) => [...prev, teamName.trim()]);
      setFormMsg({ text: `✅ ${teamName.trim()} registered! (Demo Mode)`, type: "ok" });
      resetForm(); setSubmitLoading(false); return;
    }

    try {
      await fetch(sheetApiUrl, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setRegisteredTeams((prev) => [...prev, teamName.trim()]);
      setFormMsg({ text: `✅ ${teamName.trim()} registered successfully!`, type: "ok" });
      resetForm();
    } catch {
      setFormMsg({ text: "⚠️ Error submitting. Please try again.", type: "error" });
    } finally { setSubmitLoading(false); }
  };

  const resetForm = () => {
    setTeamName(""); setP1Name(""); setP1Uid("");
    setP2Name(""); setP2Uid(""); setWhatsapp(""); setUtr("");
    removeScreenshot();
  };

  const getFbEmbed = (url) => {
    if (!url) return null;
    try { return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`; }
    catch { return null; }
  };

  const slotsLeft = Math.max(0, selectedTournament.slots - registeredTeams.length);

  return (
    <div className="poster-wrapper">

      {/* ── WARNING TAPE ── */}
      <div className="tape">
        <span>DS Clan Presents &nbsp;•&nbsp; Duo Tournament &nbsp;•&nbsp; BGMI</span>
      </div>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-glow" />
        <div className="drop-ring" />
        <div className="radar-sweep" />

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

        {/* BGMI Soldier Sketch */}
        <svg className="bgmi-sketch" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ff8a1e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <ellipse cx="100" cy="40" rx="20" ry="22" />
          <path d="M82 35 Q90 20 100 18 Q110 20 118 35" />
          {/* Helmet */}
          <path d="M80 38 Q82 25 100 22 Q118 25 120 38" />
          <path d="M80 38 L76 46 M120 38 L124 46" />
          {/* Body */}
          <path d="M90 62 L88 130 L80 200" />
          <path d="M110 62 L112 130 L120 200" />
          <path d="M88 130 L112 130" />
          {/* Vest lines */}
          <path d="M90 70 L110 70 M90 80 L110 80 M90 90 L108 90" />
          {/* Arms */}
          <path d="M90 65 L65 100 L58 130 L66 134" />
          <path d="M110 65 L140 90 L148 110" />
          {/* Gun */}
          <path d="M140 90 L170 82 L175 84 L160 96 L148 110" />
          <path d="M155 85 L165 82" />
          <rect x="142" y="92" width="12" height="6" />
          {/* Hands on gun */}
          <path d="M140 90 L145 94" />
          {/* Legs */}
          <path d="M88 200 L84 280 L78 340 L88 344" />
          <path d="M112 200 L116 280 L122 340 L112 344" />
          {/* Boots */}
          <path d="M78 340 L72 350 L90 352 L92 340" />
          <path d="M122 340 L128 350 L110 352 L108 340" />
          {/* Backpack hint */}
          <path d="M112 70 L130 80 L128 120 L112 118" />
          {/* Belt/pouches */}
          <path d="M88 140 L112 140" />
          <rect x="92" y="140" width="8" height="10" />
          <rect x="103" y="140" width="8" height="10" />
        </svg>

        {/* Badge */}
        <div className="badge-row">
          <div className="badge"><span>DS</span></div>
        </div>

        <div className="eyebrow">DS Clan Mobile Battle Royale</div>

        <div className="brand">BGMI <span className="hl">DUO</span></div>
        <div className="subline">Tournament <em>Day</em></div>
        <div className="tagline">Drop in. Squad of 2. Two matches, one champion.</div>

        <div className="cta-row">
          <a href="#register" className="btn btn-primary">Register Now →</a>
          <a href="#rules" className="btn btn-ghost">Read Rules</a>
        </div>
      </section>

      {/* ── STAT DOG-TAGS ── */}
      <div className="stats">
        <div className="tag"><div className="k">Date</div><div className="v">{selectedTournament.date}</div></div>
        <div className="tag"><div className="k">Timings</div><div className="v">9:30 AM &amp;<br />6:30 PM</div></div>
        <div className="tag"><div className="k">Mode</div><div className="v">{selectedTournament.mode}</div></div>
        <div className="tag"><div className="k">Max Teams</div><div className="v">{selectedTournament.slots}</div></div>
        <div className="tag danger"><div className="k">Entry Fee</div><div className="v">{selectedTournament.entryFee} / Team</div></div>
      </div>

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── POINTS SYSTEM ── */}
      <div className="content-section">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Points System</h2>
            <div className="code">RANK + KILL</div>
          </div>
        </div>
        <div className="points-table">
          <div className="prow gold">
            <div className="rank">#1</div>
            <div className="plabel">Winner Winner Chicken Dinner</div>
            <div className="pval">10 PTS</div>
          </div>
          <div className="prow">
            <div className="rank">#2</div>
            <div className="plabel">Runner-Up</div>
            <div className="pval">8 PTS</div>
          </div>
          <div className="prow">
            <div className="rank">#3</div>
            <div className="plabel">Third Place</div>
            <div className="pval">6 PTS</div>
          </div>
        </div>
        <div className="kill-row">
          <div className="plabel">Per Kill</div>
          <div className="pval">1 PT</div>
        </div>
      </div>

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── PRIZE POOL PODIUM ── */}
      <div className="content-section">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Prize Pool</h2>
            <div className="code">{selectedTournament.prizePool}</div>
          </div>
        </div>

        <div className="prize-stage">
          <div className="confetti-wrap">
            {confettiItems.map((p) => (
              <i key={p.id} style={{
                left: p.left, background: p.bg,
                animationDuration: p.dur, animationDelay: p.delay,
                opacity: p.opacity, transform: p.rot,
              }} />
            ))}
          </div>

          {/* 2nd Place */}
          <div className="podium-figure p2">
            <div className="player-icon">
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
                <circle cx="50" cy="26" r="14" fill="#12160f" stroke="#c7d3dd" strokeWidth="2.5"/>
                <path d="M50 8 L50 2 M42 6 L46 10 M58 6 L54 10" stroke="#c7d3dd" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M28 90 C28 60 34 44 50 44 C66 44 72 60 72 90" fill="#1a2013" stroke="#c7d3dd" strokeWidth="2.5"/>
                <path d="M50 44 L50 66" stroke="#c7d3dd" strokeWidth="2.5"/>
                <g transform="translate(14,12)">
                  <path d="M0 0 h20 v10 a10 10 0 0 1 -20 0 z" fill="none" stroke="#c7d3dd" strokeWidth="2"/>
                  <path d="M0 2 c-6 0 -6 10 0 10" fill="none" stroke="#c7d3dd" strokeWidth="2"/>
                  <path d="M20 2 c6 0 6 10 0 10" fill="none" stroke="#c7d3dd" strokeWidth="2"/>
                </g>
              </svg>
            </div>
            <div className="trophy-amt" style={{color:"#c7d3dd"}}>{selectedTournament.prizes?.second || "₹250"}</div>
            <div className="rank-badge">2nd Place</div>
            <div className="podium-bar"><span className="podium-num">2</span></div>
          </div>

          {/* 1st Place */}
          <div className="podium-figure p1">
            <div className="player-icon">
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
                <circle cx="50" cy="24" r="15" fill="#12160f" stroke="#f4c430" strokeWidth="3"/>
                <path d="M50 6 L50 -1 M40 4 L45 9 M60 4 L55 9" stroke="#f4c430" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M26 92 C26 58 33 42 50 42 C67 42 74 58 74 92" fill="#1a2013" stroke="#f4c430" strokeWidth="3"/>
                <path d="M50 42 L50 66" stroke="#f4c430" strokeWidth="3"/>
                <g transform="translate(8,6)">
                  <path d="M0 0 h24 v12 a12 12 0 0 1 -24 0 z" fill="none" stroke="#f4c430" strokeWidth="2.5"/>
                  <path d="M0 2 c-7 0 -7 12 0 12" fill="none" stroke="#f4c430" strokeWidth="2.5"/>
                  <path d="M24 2 c7 0 7 12 0 12" fill="none" stroke="#f4c430" strokeWidth="2.5"/>
                </g>
              </svg>
            </div>
            <div className="trophy-amt">{selectedTournament.prizes?.first || "₹350"}</div>
            <div className="rank-badge">Champions</div>
            <div className="podium-bar"><span className="podium-num">1</span></div>
          </div>

          {/* 3rd Place */}
          <div className="podium-figure p3">
            <div className="player-icon">
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
                <circle cx="50" cy="28" r="13" fill="#12160f" stroke="#cd7f32" strokeWidth="2.5"/>
                <path d="M50 10 L50 4 M43 8 L47 12 M57 8 L53 12" stroke="#cd7f32" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M30 88 C30 62 35 46 50 46 C65 46 70 62 70 88" fill="#1a2013" stroke="#cd7f32" strokeWidth="2.5"/>
                <path d="M50 46 L50 66" stroke="#cd7f32" strokeWidth="2.5"/>
                <g transform="translate(16,16)">
                  <path d="M0 0 h18 v9 a9 9 0 0 1 -18 0 z" fill="none" stroke="#cd7f32" strokeWidth="2"/>
                  <path d="M0 2 c-5 0 -5 9 0 9" fill="none" stroke="#cd7f32" strokeWidth="2"/>
                  <path d="M18 2 c5 0 5 9 0 9" fill="none" stroke="#cd7f32" strokeWidth="2"/>
                </g>
              </svg>
            </div>
            <div className="trophy-amt" style={{color:"#cd7f32"}}>{selectedTournament.prizes?.third || "₹200"}</div>
            <div className="rank-badge">3rd Place</div>
            <div className="podium-bar"><span className="podium-num">3</span></div>
          </div>
        </div>

        <div className="prize-total">
          Total Prize Pool <b>{selectedTournament.prizePool}</b> · Rank + Kill Points Decide the Champion
        </div>
      </div>

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── RULES ── */}
      <div className="content-section" id="rules">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Rules of Engagement</h2>
            <div className="code">READ BEFORE DROP</div>
          </div>
        </div>
        <ul className="rules-list">
          <li className="critical"><b>01</b> Hacks, cheats, mod menus, GFX injectors or any illegal third-party tool are strictly banned — instant disqualification, no refund.</li>
          <li><b>02</b> Team size is fixed at 2 players (Duo). No substitutes allowed once a match begins.</li>
          <li><b>03</b> Two matches on the day — Match 1 at 9:30 AM, Match 2 at 6:30 PM. Be online 10 minutes before each match.</li>
          <li><b>04</b> Room ID &amp; password will be shared before every match — miss the timing and you miss the slot.</li>
          <li className="critical"><b>05</b> Teaming up with rival squads during any match is strictly banned and leads to disqualification.</li>
          <li><b>06</b> Submit a screenshot of the final result screen after each match for score verification.</li>
          <li><b>07</b> Final standings are decided by combined points from both matches (placement points + kill points).</li>
          <li><b>08</b> Entry fee of {selectedTournament.entryFee} per team is non-refundable once your slot is confirmed.</li>
          <li><b>09</b> Only the first {selectedTournament.slots} teams to complete payment get a confirmed slot.</li>
          <li><b>10</b> The organiser&apos;s decision on any dispute or rule violation is final.</li>
        </ul>
      </div>

      {/* ── REGISTER BANNER ── */}
      <div className="register-banner">
        <div className="left">
          <h3>Slots Filling Fast</h3>
          <p>Pay {selectedTournament.entryFee} to lock your squad&apos;s spot</p>
        </div>
        <div className="right">
          <div className="lbl">Contact / Register</div>
          <div className="num">+91 8969099134</div>
        </div>
      </div>

      {/* ── PAY & REGISTER FORM ── */}
      <div className="content-section" id="register">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Pay &amp; Register</h2>
            <div className="code">SLOT CONFIRMATION</div>
          </div>
        </div>

        <div className="reg-flow">
          <div className="pay-card">
            <div className="pay-lbl">Scan &amp; Pay</div>
            <img src="/payment-qr.jpg" alt="PhonePe QR Code" />
            <div className="payee-name">ROHIT KUMAR</div>
            <div className="pay-instruction">Pay {selectedTournament.entryFee} · Then fill the form →</div>
          </div>

          <div className="form-card">
            <h3>Team Registration</h3>
            <form className="reg-form" onSubmit={handleRegister}>
              <div>
                <label className="form-label" htmlFor="teamName">Team Name</label>
                <input className="form-input" id="teamName" type="text" required maxLength={40} placeholder="e.g. GHOST RECON" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              </div>
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
              <div>
                <label className="form-label" htmlFor="whatsapp">WhatsApp Number</label>
                <input className="form-input" id="whatsapp" type="tel" required maxLength={15} inputMode="numeric" placeholder="10-digit number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div>
                <label className="form-label" htmlFor="utr">Payment UTR / Transaction ID</label>
                <input className="form-input" id="utr" type="text" required maxLength={30} placeholder="From PhonePe payment screen" value={utr} onChange={(e) => setUtr(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Payment Screenshot</label>
                {screenshotPreview ? (
                  <div style={{textAlign:"center"}}>
                    <div className="screenshot-preview">
                      <img src={screenshotPreview} alt="Screenshot preview" />
                      <button type="button" className="remove-btn" onClick={removeScreenshot}>✕</button>
                    </div>
                    <p style={{marginTop:"6px",fontSize:"12px",color:"#39ffe3",fontFamily:"'Share Tech Mono',monospace"}}>
                      ✓ SCREENSHOT ATTACHED
                    </p>
                  </div>
                ) : (
                  <div
                    className={`upload-zone${dragOver ? " drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} aria-label="Upload payment screenshot" />
                    <span className="upload-icon">📷</span>
                    <div className="upload-text">Upload Screenshot</div>
                    <div className="upload-subtext">Drag &amp; drop or click · JPG, PNG (max 5MB)</div>
                  </div>
                )}
              </div>
              <button type="submit" className="submit-btn" disabled={submitLoading}>
                {submitLoading ? "SUBMITTING..." : "Confirm Registration"}
              </button>
              {formMsg.text && (
                <div className={formMsg.type === "ok" ? "form-msg-ok" : "form-msg-err"}>{formMsg.text}</div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── REGISTERED TEAMS ── */}
      <div className="content-section" id="teams">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Confirmed Lobby</h2>
            <div className="code">{registeredTeams.length} / {selectedTournament.slots} SLOTS</div>
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
      </div>

      <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>

      {/* ── WINNERS HALL ── */}
      {winners && winners.length > 0 && (
        <div className="content-section" id="winners">
          <div className="section-head">
            <div className="section-head-inner">
              <h2>Hall of Fame</h2>
              <div className="code">TOURNAMENT CHAMPIONS</div>
            </div>
          </div>
          <div className="winners-grid">
            {winners.map((w, i) => (
              <div className="winner-card" key={i}>
                <svg className="winner-crown" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 4l3 3 7-5 7 5 3-3v14H2V4zm2 12h16v-2H4v2zm0-4h16V9.82l-2 2-6-4.29-6 4.29-2-2V12z"/>
                </svg>
                <div className="winner-t-name">{w.tournament}</div>
                <div className="winner-team">🏆 {w.team}</div>
                <div className="winner-players">
                  {w.players?.map((p) => <span key={p}>{p}</span>)}
                </div>
                <p className="winner-quote">&ldquo; {w.quote} &rdquo;</p>
                <div className="winner-meta">
                  <span>Date: <b>{w.date}</b></span>
                  <span>Kills: <b>{w.kills}</b></span>
                  <span>Prize: <b style={{color:"var(--warn)"}}>{w.prize}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FACEBOOK VIDEOS ── */}
      {videos && videos.length > 0 && (
        <>
          <div className="divider inner"><div className="line"/><div className="diamond"/><div className="line"/></div>
          <div className="content-section" id="videos">
            <div className="section-head">
              <div className="section-head-inner">
                <h2>Match Highlights</h2>
                <div className="code">CLUTCHES &amp; STREAMS</div>
              </div>
            </div>
            <div className="video-grid">
              {videos.map((v, i) => {
                const embed = getFbEmbed(v.url);
                if (!embed) return null;
                return (
                  <div className="video-card" key={i}>
                    <div className="video-frame-wrap">
                      <iframe src={embed} scrolling="no" frameBorder="0" allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title={v.title} />
                    </div>
                    <div className="video-info">
                      <h4>{v.title}</h4>
                      <p>{v.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── FOOTER ── */}
      <div className="footer">
        Only <span className="squads">{selectedTournament.slots} Squads</span> Get In &nbsp;·&nbsp; Fair Play Only &nbsp;·&nbsp; DS Clan
      </div>

    </div>
  );
}

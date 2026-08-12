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

  const [teamName, setTeamName] = useState("");
  const [p1Name, setP1Name] = useState("");
  const [p1Uid, setP1Uid] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [p2Uid, setP2Uid] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [utr, setUtr] = useState("");

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState("");
  const [screenshotMime, setScreenshotMime] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`/api/teams?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.teams) setRegisteredTeams(data.teams);
      })
      .catch(() => {})
      .finally(() => setLoadingTeams(false));
  }, []);

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
      setScreenshotBase64(e.target.result);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitLoading) return;

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
      await new Promise((r) => setTimeout(r, 800));
      setRegisteredTeams((prev) => [...prev, teamName.trim()]);
      setFormMsg({ text: `✅ ${teamName.trim()} registered! (Demo Mode)`, type: "ok" });
      resetForm();
      setSubmitLoading(false);
      return;
    }

    try {
      await fetch(sheetApiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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

  const slotsLeft = selectedTournament.slots - registeredTeams.length;

  return (
    <div className="poster-wrapper">
      {/* ── TOP WARNING TAPE ── */}
      <div className="tape">
        <span>DS Clan Presents &nbsp;•&nbsp; Duo Tournament &nbsp;•&nbsp; BGMI</span>
      </div>

      {/* ── CLAN BADGE ── */}
      <div className="badge-row">
        <div className="badge">
          <span>DS</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="drop-ring"></div>

        <svg className="crosshair tl" width="46" height="46" viewBox="0 0 46 46">
          <g stroke="#ff8a1e" strokeWidth="1.4" fill="none">
            <line x1="23" y1="0" x2="23" y2="14" />
            <line x1="23" y1="32" x2="23" y2="46" />
            <line x1="0" y1="23" x2="14" y2="23" />
            <line x1="32" y1="23" x2="46" y2="23" />
            <circle cx="23" cy="23" r="9" />
          </g>
        </svg>
        <svg className="crosshair br" width="46" height="46" viewBox="0 0 46 46">
          <g stroke="#ff8a1e" strokeWidth="1.4" fill="none">
            <line x1="23" y1="0" x2="23" y2="14" />
            <line x1="23" y1="32" x2="23" y2="46" />
            <line x1="0" y1="23" x2="14" y2="23" />
            <line x1="32" y1="23" x2="46" y2="23" />
            <circle cx="23" cy="23" r="9" />
          </g>
        </svg>

        <div className="eyebrow">DS Clan Mobile Battle Royale</div>
        <div className="brand">
          BGMI <span className="hl">DUO</span>
        </div>
        <div className="subline">
          Tournament <em>Day</em>
        </div>
        <div className="tagline">Drop in. Squad of 2. Two matches, one champion.</div>

        <div className="cta-row">
          <a href="#register" className="btn btn-primary">
            Register Now →
          </a>
          <a href="#rules" className="btn btn-ghost">
            Read Rules
          </a>
        </div>
      </div>

      {/* ── STAT DOG-TAGS ── */}
      <div className="stats">
        <div className="tag">
          <div className="k">Date</div>
          <div className="v">{selectedTournament.date}</div>
        </div>
        <div className="tag">
          <div className="k">Timings</div>
          <div className="v">
            9:30 AM &amp;
            <br />
            6:30 PM
          </div>
        </div>
        <div className="tag">
          <div className="k">Mode</div>
          <div className="v">{selectedTournament.mode}</div>
        </div>
        <div className="tag">
          <div className="k">Max Teams</div>
          <div className="v">{selectedTournament.slots}</div>
        </div>
        <div className="tag danger">
          <div className="k">Entry Fee</div>
          <div className="v">{selectedTournament.entryFee} / Team</div>
        </div>
      </div>

      <div className="divider">
        <div className="line"></div>
        <div className="diamond"></div>
        <div className="line"></div>
      </div>

      {/* ── POINTS SYSTEM ── */}
      <div className="points-wrap">
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

      <div className="divider">
        <div className="line"></div>
        <div className="diamond"></div>
        <div className="line"></div>
      </div>

      {/* ── RULES OF ENGAGEMENT ── */}
      <div className="rules-wrap" id="rules">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Rules of Engagement</h2>
            <div className="code">READ BEFORE DROP</div>
          </div>
        </div>

        <ul className="rules-list">
          <li className="critical">
            <b>01</b> Hacks, cheats, mod menus, GFX injectors or any illegal third-party tool are
            strictly banned — instant disqualification, no refund.
          </li>
          <li>
            <b>02</b> Team size is fixed at 2 players (Duo). No substitutes allowed once a match
            begins.
          </li>
          <li>
            <b>03</b> Two matches on the day — Match 1 at 9:30 AM, Match 2 at 6:30 PM. Be online 10
            minutes before each match.
          </li>
          <li>
            <b>04</b> Room ID &amp; password will be shared before every match — miss the timing and
            you miss the slot.
          </li>
          <li className="critical">
            <b>05</b> Teaming up with rival squads during any match is strictly banned and leads to
            disqualification.
          </li>
          <li>
            <b>06</b> Submit a screenshot of the final result screen after each match for score
            verification.
          </li>
          <li>
            <b>07</b> Final standings are decided by combined points from both matches (placement
            points + kill points).
          </li>
          <li>
            <b>08</b> Entry fee of {selectedTournament.entryFee} per team is non-refundable once
            your slot is confirmed.
          </li>
          <li>
            <b>09</b> Only the first {selectedTournament.slots} teams to complete payment get a
            confirmed slot.
          </li>
          <li>
            <b>10</b> The organiser&apos;s decision on any dispute or rule violation is final.
          </li>
        </ul>
      </div>

      {/* ── REGISTER / CONTACT BANNER ── */}
      <div className="register-banner">
        <div className="left">
          <h3>Slots Filling Fast</h3>
          <p>Pay {selectedTournament.entryFee} to lock your squad&apos;s spot</p>
        </div>
        <div className="right">
          <div className="lbl">Contact / Register</div>
          <div className="num">+91 93801 02402</div>
        </div>
      </div>

      {/* ── PAY & REGISTER FORM ── */}
      <div className="form-section-wrap" id="register">
        <div className="reg-flow">
          {/* QR Code Pay Card */}
          <div className="pay-card">
            <div className="pay-lbl">Scan &amp; Pay</div>
            <img src="/payment-qr.jpg" alt="PhonePe QR Code" />
            <div className="payee-name">ROHIT KUMAR</div>
            <div className="pay-instruction">
              Pay {selectedTournament.entryFee} · Then fill the form →
            </div>
          </div>

          {/* Form */}
          <div className="form-card">
            <h3>Team Registration</h3>
            <form className="reg-form" onSubmit={handleRegister}>
              <div>
                <label className="form-label" htmlFor="teamName">
                  Team Name
                </label>
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

              <div className="field-row">
                <div>
                  <label className="form-label" htmlFor="p1Name">
                    Player 1 IGN
                  </label>
                  <input
                    className="form-input"
                    id="p1Name"
                    type="text"
                    required
                    maxLength={30}
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="p1Uid">
                    Player 1 UID
                  </label>
                  <input
                    className="form-input"
                    id="p1Uid"
                    type="text"
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
                  <label className="form-label" htmlFor="p2Name">
                    Player 2 IGN
                  </label>
                  <input
                    className="form-input"
                    id="p2Name"
                    type="text"
                    required
                    maxLength={30}
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="p2Uid">
                    Player 2 UID
                  </label>
                  <input
                    className="form-input"
                    id="p2Uid"
                    type="text"
                    required
                    maxLength={20}
                    inputMode="numeric"
                    value={p2Uid}
                    onChange={(e) => setP2Uid(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="whatsapp">
                  WhatsApp Number
                </label>
                <input
                  className="form-input"
                  id="whatsapp"
                  type="tel"
                  required
                  maxLength={15}
                  inputMode="numeric"
                  placeholder="10-digit number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="utr">
                  Payment UTR / Transaction ID
                </label>
                <input
                  className="form-input"
                  id="utr"
                  type="text"
                  required
                  maxLength={30}
                  placeholder="From PhonePe payment screen"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="form-label">Payment Screenshot</label>
                {screenshotPreview ? (
                  <div style={{ textAlign: "center" }}>
                    <div className="screenshot-preview">
                      <img src={screenshotPreview} alt="Screenshot preview" />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={removeScreenshot}
                        aria-label="Remove screenshot"
                      >
                        ✕
                      </button>
                    </div>
                    <p
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        color: "#39ffe3",
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: "1px",
                      }}
                    >
                      ✓ SCREENSHOT ATTACHED
                    </p>
                  </div>
                ) : (
                  <div
                    className={`upload-zone${dragOver ? " drag-over" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
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
                    <div className="upload-subtext">
                      Drag &amp; drop or click to browse · JPG, PNG (max 5MB)
                    </div>
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
      </div>

      {/* ── REGISTERED TEAMS ── */}
      <div className="teams-wrap-section" id="teams">
        <div className="section-head">
          <div className="section-head-inner">
            <h2>Confirmed Lobby</h2>
            <div className="code">
              {registeredTeams.length} / {selectedTournament.slots} SLOTS
            </div>
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

      {/* ── FOOTER ── */}
      <div className="footer">
        Only <span className="squads">{selectedTournament.slots} Squads</span> Get In &nbsp;·&nbsp;
        Fair Play Only &nbsp;·&nbsp; DS Clan
      </div>
    </div>
  );
}

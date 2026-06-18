"use client";

import { useState, useEffect, useRef } from "react";

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${Math.round(n).toLocaleString()}`;
}

function formatFull(n: number): string {
  return `₦${Math.round(n).toLocaleString()}`;
}

interface Results {
  monthlyChurnRate: number;
  annualChurnRate: number;
  annualRetentionRate: number;
  monthlyLoss: number;
  annualLoss: number;
  rec10: number;
  rec20: number;
  rec30: number;
  annualRec20: number;
  reetFee: number;
  netGain: number;
}

function compute(members: number, fee: number, churn: number): Results | null {
  if (!members || !fee || !churn) return null;
  const monthlyChurnRate = (churn / members) * 100;
  const monthlyRetentionRate = 100 - monthlyChurnRate;
  const annualRetentionRate = Math.pow(monthlyRetentionRate / 100, 12) * 100;
  const annualChurnRate = 100 - annualRetentionRate;
  const monthlyLoss = churn * fee;
  const annualLoss = churn * fee * 78;
  const rec10 = monthlyLoss * 0.1;
  const rec20 = monthlyLoss * 0.2;
  const rec30 = monthlyLoss * 0.3;
  const annualRec20 = rec20 * 78;
  const reetFee = annualRec20 * 0.07;
  const netGain = annualRec20 - reetFee;
  return { monthlyChurnRate, annualChurnRate, annualRetentionRate, monthlyLoss, annualLoss, rec10, rec20, rec30, annualRec20, reetFee, netGain };
}

const GYM_TYPES = [
  { label: "Boutique studio", sub: "Yoga, pilates, CrossFit", rate: 0.03 },
  { label: "Standard gym", sub: "Mid-size fitness center", rate: 0.045 },
  { label: "Large commercial", sub: "Big chains, low-cost operators", rate: 0.06 },
];

export default function RetentionCalculator() {
  const [members, setMembers] = useState("");
  const [fee, setFee] = useState("");
  const [churn, setChurn] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const membersNum = parseFloat(members) || 0;

  useEffect(() => {
    const r = compute(parseFloat(members), parseFloat(fee), parseFloat(churn));
    if (r) {
      setResults(null);
      setVisible(false);
      const t = setTimeout(() => {
        setResults(r);
        setVisible(true);
      }, 80);
      return () => clearTimeout(t);
    } else {
      setResults(null);
      setVisible(false);
    }
  }, [members, fee, churn]);

  function applyEstimate() {
    if (selectedType === null || !membersNum) return;
    const est = Math.round(membersNum * GYM_TYPES[selectedType].rate);
    setChurn(String(est));
    setApplied(true);
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    confirmTimer.current = setTimeout(() => setApplied(false), 3000);
  }

  function handleMembersChange(val: string) {
    setMembers(val);
    setSelectedType(null);
  }

  function handleChurnChange(val: string) {
    setChurn(val);
    setSelectedType(null);
  }

  const TEAL = "#00C896";
  const CORAL = "#FF4F3F";
  const DARK = "#07090A";
  const CARD = "#0C1210";
  const CARD2 = "#101710";
  const BORDER = "rgba(255,255,255,0.07)";
  const MUTED = "#4E6B5C";
  const DEEP_MUTED = "#3E5A49";

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#E8F0EC", fontFamily: "'DM Sans', 'Inter', sans-serif", overflowX: "hidden" }} className="pt-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise { animation: riseIn 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
        .gym-tile { transition: border-color 0.15s, background 0.15s; }
        .gym-tile:hover:not(.locked) { border-color: rgba(0,200,150,0.3) !important; }
        .rec-tile { transition: border-color 0.15s; }
        .rec-tile:hover { border-color: rgba(0,200,150,0.3) !important; }
        .stat-card { transition: transform 0.18s ease; }
        .stat-card:hover { transform: translateY(-2px); }
        .cta-a { transition: opacity 0.15s, transform 0.15s; }
        .cta-a:hover { opacity: 0.88; transform: translateY(-1px); }
        .apply-btn { transition: opacity 0.15s, transform 0.15s; }
        .apply-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "96px 24px 88px" }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24, color: TEAL, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: CORAL, flexShrink: 0 }} />
            Reetrack
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 800, lineHeight: 1.07, letterSpacing: "-0.03em", marginBottom: 14 }}>
            How much is member churn<br />
            <span style={{ color: TEAL }}>costing you?</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 14, fontWeight: 300, lineHeight: 1.75, maxWidth: 460 }}>
            Enter three numbers. See exactly what&apos;s bleeding out every month — and what you could get back.
          </p>
        </div>

        {/* Input panel */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 28px 32px", marginBottom: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: DEEP_MUTED, marginBottom: 22, fontFamily: "'Syne', sans-serif" }}>
            Your gym&apos;s numbers
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 0 }}>
            {[
              { id: "members", label: "Active members right now", prefix: "#", placeholder: "150", val: members, set: handleMembersChange },
              { id: "fee", label: "Average monthly membership fee", prefix: "₦", placeholder: "25000", val: fee, set: setFee },
              { id: "churn", label: "Members lost per month", prefix: "#", placeholder: "12", val: churn, set: handleChurnChange },
            ].map(f => (
              <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label htmlFor={f.id} style={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: TEAL, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif", pointerEvents: "none", zIndex: 1 }}>
                    {f.prefix}
                  </span>
                  <input
                    id={f.id}
                    type="number"
                    placeholder={f.placeholder}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    style={{ width: "100%", background: CARD2, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "13px 13px 13px 28px", fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#E8F0EC", outline: "none", transition: "border-color 0.18s" }}
                    onFocus={e => (e.target.style.borderColor = TEAL)}
                    onBlur={e => (e.target.style.borderColor = BORDER)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, margin: "24px 0 20px" }} />

          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: DEEP_MUTED, fontFamily: "'Syne', sans-serif", marginBottom: 14 }}>
            Don&apos;t know your churn? Pick your gym type
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
            {GYM_TYPES.map((g, i) => {
              const isActive = selectedType === i;
              const isLocked = !membersNum;
              const estCount = membersNum > 0 ? Math.round(membersNum * g.rate) : null;
              return (
                <button
                  key={i}
                  className={`gym-tile${isLocked ? " locked" : ""}`}
                  onClick={() => { if (!isLocked) setSelectedType(isActive ? null : i); }}
                  style={{
                    background: isActive ? "rgba(0,200,150,0.07)" : CARD2,
                    border: `1.5px solid ${isActive ? TEAL : BORDER}`,
                    borderRadius: 14,
                    padding: "14px 12px",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    textAlign: "left",
                    opacity: isLocked ? 0.38 : 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: isActive ? TEAL : "#E8F0EC", lineHeight: 1.3, marginBottom: 3 }}>
                    {g.label}
                  </span>
                  <span style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{g.sub}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: CORAL, fontFamily: "'Syne', sans-serif", marginBottom: 5 }}>
                    ~{(g.rate * 100).toFixed(1)}% lost/mo without a system
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? TEAL : MUTED, minHeight: 16, transition: "color 0.15s" }}>
                    {estCount !== null ? `≈ ${estCount} members/mo` : ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="apply-btn"
              onClick={applyEstimate}
              disabled={selectedType === null || !membersNum}
              style={{
                padding: "11px 20px",
                background: TEAL,
                color: DARK,
                border: "none",
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                cursor: selectedType !== null && membersNum ? "pointer" : "not-allowed",
                opacity: selectedType !== null && membersNum ? 1 : 0.3,
                letterSpacing: "0.03em",
              }}
            >
              Apply estimate
            </button>
            {applied && (
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, animation: "riseIn 0.3s ease forwards" }}>
                ✓ Applied
              </span>
            )}
          </div>

          {!membersNum && (
            <p style={{ fontSize: 11, color: DEEP_MUTED, marginTop: 10 }}>
              Enter your member count above to enable the estimator
            </p>
          )}
        </div>

        {/* Empty state */}
        {!results && (
          <div style={{ textAlign: "center", padding: "56px 20px", color: DEEP_MUTED }}>
            <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 10, color: TEAL }}>◫</div>
            <p style={{ fontSize: 13, fontWeight: 300 }}>Enter your numbers above to see your churn cost</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className={visible ? "rise" : ""} style={{ opacity: visible ? 1 : 0 }}>

            <div style={{ background: "rgba(255,79,63,0.07)", border: "1px solid rgba(255,79,63,0.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: CORAL, fontSize: 16, flexShrink: 0 }}>⚠</span>
              <p style={{ fontSize: 13, color: "#E8F0EC", lineHeight: 1.5 }}>
                You&apos;re losing{" "}
                <strong style={{ color: CORAL }}>{formatNaira(results.monthlyLoss)}</strong>
                {" "}every month and{" "}
                <strong style={{ color: CORAL }}>{formatNaira(results.annualLoss)}</strong>
                {" "}every year — without a retention system in place.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[
                {
                  label: "Monthly revenue lost",
                  value: formatNaira(results.monthlyLoss),
                  sub: `${churn} members × ${formatFull(parseFloat(fee))} gone every month`,
                  loss: true,
                },
                {
                  label: "Annual revenue lost",
                  value: formatNaira(results.annualLoss),
                  sub: "Cumulative: each month's losses compound — not just 12× one month",
                  loss: true,
                },
                {
                  label: "Annual churn rate",
                  value: `${results.annualChurnRate.toFixed(1)}%`,
                  valueSuffix: "/yr",
                  loss: false,
                },
                {
                  label: "Annual retention rate",
                  value: `${results.annualRetentionRate.toFixed(1)}%`,
                  sub: "Top gyms on Reetrack will average 85%+ annual retention",
                  loss: false,
                },
              ].map(c => (
                <div
                  key={c.label}
                  className="stat-card"
                  style={{
                    background: c.loss ? "rgba(255,79,63,0.04)" : CARD,
                    border: `1px solid ${c.loss ? "rgba(255,79,63,0.2)" : BORDER}`,
                    borderRadius: 18,
                    padding: "22px 20px",
                  }}
                >
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: DEEP_MUTED, marginBottom: 10, fontFamily: "'Syne', sans-serif" }}>
                    {c.label}
                  </p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 3.2vw, 28px)", fontWeight: 800, color: c.loss ? CORAL : "#E8F0EC", lineHeight: 1, marginBottom: 7 }}>
                    {c.value}
                    {"valueSuffix" in c && c.valueSuffix && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: MUTED }}>{c.valueSuffix}</span>
                    )}
                  </p>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.55 }}>{c.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "22px 24px", marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: DEEP_MUTED, fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>
                What you could recover with Reetrack
              </p>
              <div style={{ borderTop: `1px solid ${BORDER}`, margin: "10px 0 16px" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { pct: "10% improvement", mo: results.rec10 },
                  { pct: "20% improvement", mo: results.rec20 },
                  { pct: "30% improvement", mo: results.rec30 },
                ].map(r => (
                  <div
                    key={r.pct}
                    className="rec-tile"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 13, padding: "16px 12px", textAlign: "center" }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 700, color: TEAL, fontFamily: "'Syne', sans-serif", marginBottom: 7 }}>{r.pct}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 800, color: "#E8F0EC" }}>
                      {formatNaira(r.mo)}
                      <span style={{ fontSize: 12, fontWeight: 400, color: MUTED }}>/mo</span>
                    </p>
                    <p style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{formatNaira(r.mo * 78)} annually</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "24px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, marginBottom: 6, color: "#E8F0EC" }}>
                  Every month you wait costs {formatNaira(results.monthlyLoss)}
                </h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, maxWidth: 400 }}>
                  Reetrack turns attendance into a game your members can&apos;t stop playing. No setup fee. No monthly cost. We only make money when you do.
                </p>
              </div>
              <a
                href="https://reetrack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-a"
                style={{ background: TEAL, color: DARK, fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "13px 22px", borderRadius: 11, textDecoration: "none", whiteSpace: "nowrap", display: "inline-block" }}
              >
                Get started →
              </a>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback, useRef } from "react";

const SYSTEM_PROMPT = `You are a sharp, human-sounding social media writer specializing in Twitter/X and Threads posts. Your job is to craft posts that feel like they were written by a real person who actually knows their stuff — not a press release generator.

## HARD RULES

**Twitter/X:** Max 280 characters per post (including spaces, hashtags, and URLs). URLs count as 23 characters regardless of actual length.
**Threads:** Max 500 characters per post.

Always return BOTH versions — Twitter/X and Threads — as separate labeled outputs.

## VISUAL ENGAGEMENT RULES

Lead with a pattern-interrupt opener. Use ONE of these techniques per post:
- A bold statement that makes someone stop scrolling
- A surprising number or stat upfront
- A short punchy question
- Strategic emoji placement (1–3 max, as visual anchors — not decoration)
- Em-dash or colon to create visual pause and tension

Do NOT start posts with "I", "We", "Our", or "Just".

## TONE

Write like a confident human who's done the thing they're talking about. Conversational. Direct. A little wit is welcome — forced humor is not. No corporate fluff. No "excited to announce." No "game-changer" unless you're being ironic.

## STRUCTURE

1. Hook (first line — make it earn the read)
2. Value or insight (the meat)
3. Call to action or open loop (make them want to respond or click)
4. Hashtags (2–4, relevant, lowercase preferred)
5. URL (append at end if provided)

## HASHTAG RULES

Use 2–4 hashtags per post. Relevant picks only — no padding. Place at end unless one fits naturally mid-post.

## SOURCE URLS

If a source URL is provided, include it in the post. If none is provided but one would strengthen the post, flag it with: [URL NEEDED: suggested search term]

## OUTPUT FORMAT

Return results in this EXACT format with no extra commentary before or after:

**TWITTER/X** ([char count] chars)
[post text]

**THREADS** ([char count] chars)
[post text]

**HASHTAGS USED:** #tag1 #tag2 #tag3
**SOURCE:** [URL or flag]
**HOOK TECHNIQUE:** [name the technique used]`;

const TOPICS = ["Technology", "Leadership", "IT/Infrastructure", "AI & Automation", "Career", "Business", "Education", "Custom"];
const TONES = ["Professional", "Casual & Witty", "Bold & Opinionated", "Educational", "Storytelling"];
const HOOK_TYPES = ["Bold Statement", "Surprising Stat", "Punchy Question", "Emoji Anchor", "Visual Pause (— or :)"];

// ─── Detect platform ──────────────────────────────────────────────────────────
function getPlatform() {
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "other";
}

// ─── Universal clipboard utility ─────────────────────────────────────────────
// Returns "ok" | "fallback"
async function copyToClipboard(text) {
  // navigator.clipboard works if page is served over HTTPS or localhost.
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return "ok";
    } catch (_) {
      // DOMException: NotAllowedError on some Android browsers → fall through
    }
  }

  // ── execCommand fallback (Android 4.x WebView, older Samsung Browser) ──
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "width:2em",
      "height:2em",
      "padding:0",
      "border:none",
      "outline:none",
      "box-shadow:none",
      "background:transparent",
      "opacity:0",
      "font-size:16px",
      "z-index:-1",
    ].join(";");
    document.body.appendChild(el);
    el.contentEditable = "true";
    el.readOnly = false;
    el.focus();
    el.select();
    el.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    if (ok) return "ok";
  } catch (_) {}

  return "fallback";
}

// ─── Fallback modal ───────────────────────────────────────────────────────────
function FallbackModal({ text, onClose }) {
  const taRef = useRef(null);
  const handleFocus = () => {
    if (taRef.current) {
      taRef.current.select();
      taRef.current.setSelectionRange(0, text.length);
    }
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
        zIndex: 9999, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20, boxSizing: "border-box",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0f172a", border: "1px solid #334155",
          borderRadius: 16, padding: 24, width: "100%", maxWidth: 480,
          display: "flex", flexDirection: "column", gap: 14,
        }}
      >
        <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 15 }}>
          Tap the text, then copy
        </div>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
          Auto-copy isn't available in this browser.{"\n"}
          Tap inside the box then <strong style={{ color: "#94a3b8" }}>Select All and Copy</strong>.
        </p>
        <textarea
          ref={taRef}
          readOnly
          defaultValue={text}
          onFocus={handleFocus}
          onTouchStart={handleFocus}
          onClick={handleFocus}
          style={{
            background: "#020617", border: "1px solid #334155", borderRadius: 8,
            color: "#e2e8f0", padding: 14, fontSize: 15, lineHeight: 1.7,
            minHeight: 160, resize: "none", fontFamily: "Georgia, serif",
            width: "100%", boxSizing: "border-box",
            WebkitUserSelect: "text", MozUserSelect: "text", userSelect: "text",
          }}
        />
        <button
          onClick={onClose}
          style={{
            background: "#1e293b", color: "#94a3b8", border: "1px solid #334155",
            borderRadius: 8, padding: "12px", fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [state, setState] = useState("idle");
  const [showModal, setShowModal] = useState(false);

  const handleCopy = async () => {
    const result = await copyToClipboard(text);
    if (result === "ok") {
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } else {
      setState("fallback");
      setShowModal(true);
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const btnColors = {
    idle:     { bg: "#1e293b", color: "#94a3b8", border: "#334155" },
    copied:   { bg: "#166534", color: "#4ade80", border: "#166534" },
    fallback: { bg: "#451a03", color: "#fbbf24", border: "#78350f" },
  };
  const c = btnColors[state];

  return (
    <>
      <button
        onClick={handleCopy}
        style={{
          background: c.bg, color: c.color, border: `1px solid ${c.border}`,
          borderRadius: 6, padding: "6px 14px", fontSize: 12,
          cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
          fontWeight: 600, whiteSpace: "nowrap",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {state === "copied" ? "Copied!" : state === "fallback" ? "Tap to select" : "Copy"}
      </button>
      {showModal && <FallbackModal text={text} onClose={() => setShowModal(false)} />}
    </>
  );
}

// ─── Char counter ─────────────────────────────────────────────────────────────
function CharCounter({ text, limit }) {
  const count = text.length;
  const pct = Math.min(count / limit, 1);
  const color = count > limit ? "#ef4444" : count > limit * 0.85 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
      <span>Characters</span>
      <div style={{ flex: 1, height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
      <span style={{ color, fontWeight: 600, minWidth: 60 }}>{count}/{limit}</span>
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ label, content, charLimit, icon }) {
  if (!content) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{label}</span>
        </div>
        <CopyButton text={content} />
      </div>
      <div style={{
        background: "#020617", borderRadius: 8, padding: 16,
        color: "#cbd5e1", fontSize: 15, lineHeight: 1.75,
        whiteSpace: "pre-wrap", fontFamily: "Georgia, serif",
        WebkitUserSelect: "text", MozUserSelect: "text", userSelect: "text",
        WebkitTouchCallout: "default",
        cursor: "text",
      }}>
        {content}
      </div>
      <CharCounter text={content} limit={charLimit} />
    </div>
  );
}

// ─── Output parser ────────────────────────────────────────────────────────────
function parseOutput(raw) {
  const result = { twitter: "", threads: "", hashtags: "", source: "", hook: "" };
  const twitterMatch = raw.match(/\*\*TWITTER\/X\*\*[^\n]*\n([\s\S]*?)(?=\*\*THREADS\*\*|\*\*HASHTAGS|\*\*SOURCE|\*\*HOOK|$)/i);
  const threadsMatch = raw.match(/\*\*THREADS\*\*[^\n]*\n([\s\S]*?)(?=\*\*HASHTAGS|\*\*SOURCE|\*\*HOOK|\*\*TWITTER|$)/i);
  const hashtagsMatch = raw.match(/\*\*HASHTAGS USED:\*\*\s*(.+)/i);
  const sourceMatch   = raw.match(/\*\*SOURCE:\*\*\s*(.+)/i);
  const hookMatch     = raw.match(/\*\*HOOK TECHNIQUE:\*\*\s*(.+)/i);
  if (twitterMatch) result.twitter  = twitterMatch[1].trim();
  if (threadsMatch) result.threads  = threadsMatch[1].trim();
  if (hashtagsMatch) result.hashtags = hashtagsMatch[1].trim();
  if (sourceMatch)  result.source   = sourceMatch[1].trim();
  if (hookMatch)    result.hook     = hookMatch[1].trim();
  return result;
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function SocialPostGenerator() {
  const [topic, setTopic]         = useState("Technology");
  const [customTopic, setCustom]  = useState("");
  const [tone, setTone]           = useState("Professional");
  const [hookType, setHookType]   = useState("Bold Statement");
  const [content, setContent]     = useState("");
  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");

  const generate = useCallback(async () => {
    if (!content.trim()) { setError("Please enter your topic or key message."); return; }
    setError(""); setLoading(true); setResult(null);

    const topicLabel = topic === "Custom" ? customTopic : topic;
    const userPrompt = `Create social media posts about the following:

TOPIC CATEGORY: ${topicLabel}
DESIRED TONE: ${tone}
PREFERRED HOOK TYPE: ${hookType}
KEY MESSAGE / CONTENT:
${content}${url ? `\n\nSOURCE URL: ${url}` : ""}

Generate both Twitter/X and Threads versions following all rules exactly.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setResult(parseOutput(data.content?.[0]?.text || ""));
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [topic, customTopic, tone, hookType, content, url]);

  // ── Shared styles ────────────────────────────────────────────────────────
  const inputStyle = {
    background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8,
    color: "#e2e8f0", padding: "12px 14px",
    fontSize: 16,
    fontFamily: "inherit", width: "100%", boxSizing: "border-box",
    outline: "none", appearance: "none", WebkitAppearance: "none",
  };
  const labelStyle = {
    color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", marginBottom: 6, display: "block",
  };
  const pill = (active) => ({
    padding: "7px 14px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#3b82f6" : "#1e293b",
    background: active ? "#1d3461" : "#0f172a",
    color: active ? "#93c5fd" : "#64748b",
    fontSize: 13, cursor: "pointer", transition: "all 0.15s",
    fontFamily: "inherit", fontWeight: active ? 600 : 400,
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "32px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
            SOCIAL POST GENERATOR
          </div>
          <h1 style={{ fontSize: "clamp(24px,5vw,36px)", fontWeight: 800, margin: 0, lineHeight: 1.2, background: "linear-gradient(135deg,#e2e8f0 0%,#64748b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Posts That Sound Human
          </h1>
          <p style={{ color: "#475569", marginTop: 10, fontSize: 14 }}>Twitter/X &middot; Threads &middot; Built for character limits</p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, background: "#0a1628", border: "1px solid #1e293b", borderRadius: 16, padding: "24px 20px", marginBottom: 24 }}>

          <div>
            <label style={labelStyle}>Topic Category</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOPICS.map(t => <button key={t} style={pill(topic === t)} onClick={() => setTopic(t)}>{t}</button>)}
            </div>
            {topic === "Custom" && (
              <input style={{ ...inputStyle, marginTop: 10 }} placeholder="Enter your custom topic..." value={customTopic} onChange={e => setCustom(e.target.value)} />
            )}
          </div>

          <div>
            <label style={labelStyle}>Tone</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TONES.map(t => <button key={t} style={pill(tone === t)} onClick={() => setTone(t)}>{t}</button>)}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Hook Technique</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {HOOK_TYPES.map(h => <button key={h} style={pill(hookType === h)} onClick={() => setHookType(h)}>{h}</button>)}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Your Key Message or Content</label>
            <textarea
              style={{ ...inputStyle, minHeight: 130, resize: "vertical", lineHeight: 1.6 }}
              placeholder="Paste an article summary, idea, insight, announcement, or talking point. The more specific, the better the output."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Source URL <span style={{ color: "#475569", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input
              style={inputStyle}
              type="url"
              inputMode="url"
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ background: "#2d0a0a", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            style={{
              background: loading ? "#1e293b" : "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 100%)",
              color: loading ? "#475569" : "#fff",
              border: "none", borderRadius: 10, padding: "16px 24px",
              fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s", letterSpacing: "0.02em", fontFamily: "inherit",
              WebkitAppearance: "none", appearance: "none",
              touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
            }}
          >
            {loading ? "Generating..." : "Generate Posts"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ color: "#475569", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
              Generated Posts
            </div>

            <PostCard label="TWITTER / X" content={result.twitter} charLimit={280} icon="X" />
            <PostCard label="THREADS"    content={result.threads}  charLimit={500} icon="@" />

            {(result.hashtags || result.source || result.hook) && (
              <div style={{ background: "#0a1628", border: "1px solid #1e293b", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {result.hashtags && (
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hashtags: </span>
                    <span style={{ color: "#3b82f6" }}>{result.hashtags}</span>
                  </div>
                )}
                {result.source && (
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Source: </span>
                    <span style={{ color: "#cbd5e1" }}>{result.source}</span>
                  </div>
                )}
                {result.hook && (
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hook Technique: </span>
                    <span style={{ color: "#a78bfa" }}>{result.hook}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

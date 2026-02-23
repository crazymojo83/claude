import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   SYSTEM PROMPT
   ═══════════════════════════════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are a sharp, human-sounding social media writer for Twitter/X and Threads. You write like a real person who knows their stuff, not a press release generator.

## ABSOLUTE CHARACTER LIMITS (NON-NEGOTIABLE)
- Twitter/X: MAXIMUM 280 characters total. This includes every letter, space, emoji, hashtag, and URL. Count carefully. If a URL is included, it counts as 23 characters regardless of actual length. You MUST count the final post and verify it is 280 or fewer characters before outputting it. If it exceeds 280, rewrite it shorter.
- Threads: MAXIMUM 500 characters total. Same rules apply. Verify before outputting.
- ALWAYS return BOTH versions as separate labeled outputs.

## BANNED CHARACTERS AND PHRASES
- NEVER use em dashes (the long dash character). Use a colon, period, comma, or line break instead.
- NEVER use the en dash for stylistic purposes.
- NEVER start posts with "I", "We", "Our", or "Just".
- NEVER use "excited to announce", "game-changer", or corporate buzzwords.

## VISUAL ENGAGEMENT
Lead with a pattern-interrupt opener. Use ONE technique per post:
- A bold statement that stops the scroll
- A surprising number or stat upfront
- A short punchy question
- Strategic emoji placement (1-3 max, as visual anchors, not decoration)
- A colon to create visual pause and tension

## TONE
Confident human who has done the thing. Conversational. Direct. Wit welcome, forced humor not.

## STRUCTURE
1. Hook (first line earns the read)
2. Value or insight
3. Call to action or open loop
4. Hashtags (2-4, relevant, lowercase preferred, placed at end)
5. URL appended at end if provided

## SOURCE URLS
If provided, include in the post. If none provided but one would help, flag: [URL NEEDED: suggested search term]

## OUTPUT FORMAT
Return EXACTLY this format, no extra commentary:

**TWITTER/X** ([exact char count] chars)
[post text that is verified to be at or under 280 characters]

**THREADS** ([exact char count] chars)
[post text that is verified to be at or under 500 characters]

**HASHTAGS USED:** #tag1 #tag2 #tag3
**SOURCE:** [URL or flag]
**HOOK TECHNIQUE:** [name the technique used]

IMPORTANT: Double-check your character counts. The number in parentheses MUST match the actual character count of the post text. The Twitter/X post MUST be 280 or fewer characters. No exceptions.`;

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const TOPICS = ["Technology","Leadership","IT/Infrastructure","AI & Automation","Career","Business","Education","Custom"];
const TONES = ["Professional","Casual & Witty","Bold & Opinionated","Educational","Storytelling"];
const HOOK_TYPES = ["Bold Statement","Surprising Stat","Punchy Question","Emoji Anchor","Visual Pause (:)"];

const MODELS = [
  { id:"claude-sonnet-4-20250514", label:"Sonnet 4", desc:"Fast & sharp", icon:"⚡" },
  { id:"claude-opus-4-20250514", label:"Opus 4", desc:"Maximum quality", icon:"💎" },
  { id:"claude-haiku-4-5-20251001", label:"Haiku 4.5", desc:"Lightning fast", icon:"🍃" },
];

const PRESETS = [
  { label:"🚀 Product Launch", topic:"Technology", tone:"Bold & Opinionated", hook:"Bold Statement", content:"We're launching a new product/feature that solves [problem]. Key benefits: [list 2-3]. Available now at [link]." },
  { label:"🔥 Hot Take", topic:"Technology", tone:"Bold & Opinionated", hook:"Bold Statement", content:"Unpopular opinion: [your contrarian view on an industry trend]. Here's why most people get this wrong..." },
  { label:"💡 Quick Tip", topic:"Technology", tone:"Educational", hook:"Punchy Question", content:"Here's a practical tip that saved me hours: [describe the tip and the problem it solves]." },
  { label:"📊 Data Insight", topic:"Business", tone:"Professional", hook:"Surprising Stat", content:"New data shows [surprising statistic]. What this means for [industry/audience]: [insight]." },
  { label:"🎯 Career Win", topic:"Career", tone:"Storytelling", hook:"Visual Pause (— or :)", content:"Just hit a milestone: [achievement]. The lesson that got me here: [key insight]. If you're working toward something similar..." },
  { label:"⚡ Thread Hook", topic:"Technology", tone:"Casual & Witty", hook:"Punchy Question", content:"Here's what nobody tells you about [topic]. I learned this after [experience]. Thread incoming..." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════════════════ */
const ALL_CSS = `
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(59,130,246,0.15)}50%{box-shadow:0 0 20px rgba(59,130,246,0.3)}}
@keyframes ripple{0%{transform:scale(0);opacity:0.5}100%{transform:scale(4);opacity:0}}
@keyframes pressDown{0%{transform:scale(1)}50%{transform:scale(0.96)}100%{transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}

@keyframes lobsterBob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-3px) rotate(-2deg)}75%{transform:translateY(-3px) rotate(2deg)}}
@keyframes antennaWiggleL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-8deg)}}
@keyframes antennaWiggleR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
@keyframes clawSnapL{0%,100%{transform:rotate(0deg)}40%{transform:rotate(-12deg)}50%{transform:rotate(5deg)}60%{transform:rotate(-3deg)}}
@keyframes clawSnapR{0%,100%{transform:rotate(0deg)}40%{transform:rotate(12deg)}50%{transform:rotate(-5deg)}60%{transform:rotate(3deg)}}
@keyframes legWiggle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(10deg)}}
@keyframes tailFlick{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.1)}}

*{-webkit-tap-highlight-color:transparent}
.hover-lift{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
@media(hover:hover){.hover-lift:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.35)}}
.hover-border{transition:border-color .2s ease,background .2s ease}
@media(hover:hover){.hover-border:hover{border-color:#334155 !important}}
.hover-glow{transition:all .2s ease}
@media(hover:hover){.hover-glow:hover{box-shadow:0 0 16px rgba(59,130,246,0.2);border-color:#3b82f6 !important}}
.tap-bounce:active{animation:pressDown .2s ease}
.btn-ripple{position:relative;overflow:hidden}
.btn-ripple .ripple-circle{position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);width:20px;height:20px;pointer-events:none;animation:ripple .6s ease-out forwards}
.focus-ring:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
.scrollbar-thin::-webkit-scrollbar{width:6px}
.scrollbar-thin::-webkit-scrollbar-track{background:transparent}
.scrollbar-thin::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
.scrollbar-thin::-webkit-scrollbar-thumb:hover{background:#334155}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */
async function copyToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try { await navigator.clipboard.writeText(text); return "ok"; } catch (_) {}
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0;font-size:16px;z-index:-1";
    document.body.appendChild(el);
    el.contentEditable = "true"; el.readOnly = false; el.focus(); el.select(); el.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    if (ok) return "ok";
  } catch (_) {}
  return "fallback";
}

function useRipple() {
  return (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement("span");
    circle.className = "ripple-circle";
    circle.style.left = `${e.clientX - rect.left - 10}px`;
    circle.style.top = `${e.clientY - rect.top - 10}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };
}

function parseOutput(raw) {
  const r = { twitter:"",threads:"",hashtags:"",source:"",hook:"" };
  const tw = raw.match(/\*\*TWITTER\/X\*\*[^\n]*\n([\s\S]*?)(?=\*\*THREADS\*\*|\*\*HASHTAGS|\*\*SOURCE|\*\*HOOK|$)/i);
  const th = raw.match(/\*\*THREADS\*\*[^\n]*\n([\s\S]*?)(?=\*\*HASHTAGS|\*\*SOURCE|\*\*HOOK|\*\*TWITTER|$)/i);
  const ha = raw.match(/\*\*HASHTAGS USED:\*\*\s*(.+)/i);
  const so = raw.match(/\*\*SOURCE:\*\*\s*(.+)/i);
  const ho = raw.match(/\*\*HOOK TECHNIQUE:\*\*\s*(.+)/i);
  if(tw) r.twitter=tw[1].trim(); if(th) r.threads=th[1].trim();
  if(ha) r.hashtags=ha[1].trim(); if(so) r.source=so[1].trim(); if(ho) r.hook=ho[1].trim();
  return r;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function ClaudeLobster({ size = 40, animate = false, style = {} }) {
  const P = 1; // pixel unit in the 16x16 grid
  const grid = [
    // Row 0 - antenna tips
    [3,0,"#F4A683"],[12,0,"#F4A683"],
    // Row 1 - antenna stalks
    [4,1,"#E87F5F"],[11,1,"#E87F5F"],
    // Row 2 - antenna stalks lower
    [5,2,"#E87F5F"],[10,2,"#E87F5F"],
    // Row 3 - top of head
    [6,3,"#E87F5F"],[7,3,"#E87F5F"],[8,3,"#E87F5F"],[9,3,"#E87F5F"],
    // Row 4 - head with eyes
    [5,4,"#E87F5F"],[6,4,"#1a1a2e"],[7,4,"#F4A683"],[8,4,"#F4A683"],[9,4,"#1a1a2e"],[10,4,"#E87F5F"],
    // Row 5 - head, eye highlights + mouth
    [5,5,"#E87F5F"],[6,5,"#E87F5F"],[7,5,"#D16A4A"],[8,5,"#D16A4A"],[9,5,"#E87F5F"],[10,5,"#E87F5F"],
    // Row 6 - upper body + claw arms
    [3,6,"#F4A683"],[4,6,"#E87F5F"],[5,6,"#E87F5F"],[6,6,"#E87F5F"],[7,6,"#E87F5F"],[8,6,"#E87F5F"],[9,6,"#E87F5F"],[10,6,"#E87F5F"],[11,6,"#E87F5F"],[12,6,"#F4A683"],
    // Row 7 - claws + body
    [1,7,"#F4A683"],[2,7,"#F4A683"],[3,7,"#E87F5F"],[5,7,"#D16A4A"],[6,7,"#E87F5F"],[7,7,"#E87F5F"],[8,7,"#E87F5F"],[9,7,"#E87F5F"],[10,7,"#D16A4A"],[12,7,"#E87F5F"],[13,7,"#F4A683"],[14,7,"#F4A683"],
    // Row 8 - claw tips + body
    [0,8,"#F4A683"],[1,8,"#F4A683"],[2,8,"#E87F5F"],[5,8,"#E87F5F"],[6,8,"#F4A683"],[7,8,"#E87F5F"],[8,8,"#E87F5F"],[9,8,"#F4A683"],[10,8,"#E87F5F"],[13,8,"#E87F5F"],[14,8,"#F4A683"],[15,8,"#F4A683"],
    // Row 9 - body
    [5,9,"#E87F5F"],[6,9,"#E87F5F"],[7,9,"#D16A4A"],[8,9,"#D16A4A"],[9,9,"#E87F5F"],[10,9,"#E87F5F"],
    // Row 10 - body + legs
    [3,10,"#D16A4A"],[5,10,"#D16A4A"],[6,10,"#E87F5F"],[7,10,"#E87F5F"],[8,10,"#E87F5F"],[9,10,"#E87F5F"],[10,10,"#D16A4A"],[12,10,"#D16A4A"],
    // Row 11 - lower body + legs
    [2,11,"#D16A4A"],[4,11,"#D16A4A"],[6,11,"#E87F5F"],[7,11,"#D16A4A"],[8,11,"#D16A4A"],[9,11,"#E87F5F"],[11,11,"#D16A4A"],[13,11,"#D16A4A"],
    // Row 12 - tail section
    [6,12,"#D16A4A"],[7,12,"#E87F5F"],[8,12,"#E87F5F"],[9,12,"#D16A4A"],
    // Row 13 - tail
    [7,13,"#C05A3A"],[8,13,"#C05A3A"],
    // Row 14 - tail fan
    [6,14,"#C05A3A"],[7,14,"#D16A4A"],[8,14,"#D16A4A"],[9,14,"#C05A3A"],
    // Row 15 - tail fan tips
    [5,15,"#C05A3A"],[6,15,"#D16A4A"],[9,15,"#D16A4A"],[10,15,"#C05A3A"],
  ];

  const scale = size / 16;

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={{
        animation: animate ? "lobsterBob 1.2s ease-in-out infinite" : "none",
        imageRendering: "pixelated",
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* Antennae group - animated */}
      <g style={{ animation: animate ? "antennaWiggleL 2s ease-in-out infinite" : "none", transformOrigin: "5px 3px" }}>
        <rect x={3} y={0} width={P} height={P} fill="#F4A683" />
        <rect x={4} y={1} width={P} height={P} fill="#E87F5F" />
        <rect x={5} y={2} width={P} height={P} fill="#E87F5F" />
      </g>
      <g style={{ animation: animate ? "antennaWiggleR 2s ease-in-out infinite" : "none", transformOrigin: "10px 3px" }}>
        <rect x={12} y={0} width={P} height={P} fill="#F4A683" />
        <rect x={11} y={1} width={P} height={P} fill="#E87F5F" />
        <rect x={10} y={2} width={P} height={P} fill="#E87F5F" />
      </g>

      {/* Left claw - animated */}
      <g style={{ animation: animate ? "clawSnapL 1.5s ease-in-out infinite" : "none", transformOrigin: "3px 7px" }}>
        <rect x={0} y={8} width={P} height={P} fill="#F4A683" />
        <rect x={1} y={7} width={P} height={P} fill="#F4A683" />
        <rect x={1} y={8} width={P} height={P} fill="#F4A683" />
        <rect x={2} y={8} width={P} height={P} fill="#E87F5F" />
        <rect x={3} y={6} width={P} height={P} fill="#F4A683" />
      </g>

      {/* Right claw - animated */}
      <g style={{ animation: animate ? "clawSnapR 1.5s ease-in-out infinite 0.3s" : "none", transformOrigin: "12px 7px" }}>
        <rect x={15} y={8} width={P} height={P} fill="#F4A683" />
        <rect x={14} y={7} width={P} height={P} fill="#F4A683" />
        <rect x={14} y={8} width={P} height={P} fill="#F4A683" />
        <rect x={13} y={8} width={P} height={P} fill="#E87F5F" />
        <rect x={12} y={6} width={P} height={P} fill="#F4A683" />
      </g>

      {/* Left legs - animated */}
      {[[3,10],[2,11],[4,11]].map(([x,y],i) => (
        <rect key={`ll${i}`} x={x} y={y} width={P} height={P} fill="#D16A4A"
          style={{ animation: animate ? `legWiggle 0.8s ease-in-out infinite ${i*0.15}s` : "none", transformOrigin: `${5}px ${10}px` }} />
      ))}
      {/* Right legs - animated */}
      {[[12,10],[13,11],[11,11]].map(([x,y],i) => (
        <rect key={`rl${i}`} x={x} y={y} width={P} height={P} fill="#D16A4A"
          style={{ animation: animate ? `legWiggle 0.8s ease-in-out infinite ${i*0.15+0.4}s` : "none", transformOrigin: `${10}px ${10}px` }} />
      ))}

      {/* Tail - animated */}
      <g style={{ animation: animate ? "tailFlick 2s ease-in-out infinite" : "none", transformOrigin: "8px 13px" }}>
        <rect x={7} y={13} width={P} height={P} fill="#C05A3A" />
        <rect x={8} y={13} width={P} height={P} fill="#C05A3A" />
        <rect x={6} y={14} width={P} height={P} fill="#C05A3A" />
        <rect x={7} y={14} width={P} height={P} fill="#D16A4A" />
        <rect x={8} y={14} width={P} height={P} fill="#D16A4A" />
        <rect x={9} y={14} width={P} height={P} fill="#C05A3A" />
        <rect x={5} y={15} width={P} height={P} fill="#C05A3A" />
        <rect x={6} y={15} width={P} height={P} fill="#D16A4A" />
        <rect x={9} y={15} width={P} height={P} fill="#D16A4A" />
        <rect x={10} y={15} width={P} height={P} fill="#C05A3A" />
      </g>

      {/* Static body pixels (head, body, shell lines) */}
      {/* Head row 3 */}
      <rect x={6} y={3} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={3} width={P} height={P} fill="#E87F5F" />
      <rect x={8} y={3} width={P} height={P} fill="#E87F5F" />
      <rect x={9} y={3} width={P} height={P} fill="#E87F5F" />
      {/* Head row 4 - eyes */}
      <rect x={5} y={4} width={P} height={P} fill="#E87F5F" />
      <rect x={6} y={4} width={P} height={P} fill="#1a1a2e" />
      <rect x={7} y={4} width={P} height={P} fill="#F4A683" />
      <rect x={8} y={4} width={P} height={P} fill="#F4A683" />
      <rect x={9} y={4} width={P} height={P} fill="#1a1a2e" />
      <rect x={10} y={4} width={P} height={P} fill="#E87F5F" />
      {/* Head row 5 - mouth */}
      <rect x={5} y={5} width={P} height={P} fill="#E87F5F" />
      <rect x={6} y={5} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={5} width={P} height={P} fill="#D16A4A" />
      <rect x={8} y={5} width={P} height={P} fill="#D16A4A" />
      <rect x={9} y={5} width={P} height={P} fill="#E87F5F" />
      <rect x={10} y={5} width={P} height={P} fill="#E87F5F" />
      {/* Body row 6 */}
      {[4,5,6,7,8,9,10,11].map(x => <rect key={`r6-${x}`} x={x} y={6} width={P} height={P} fill="#E87F5F" />)}
      {/* Body row 7 */}
      <rect x={3} y={7} width={P} height={P} fill="#E87F5F" />
      <rect x={5} y={7} width={P} height={P} fill="#D16A4A" />
      <rect x={6} y={7} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={7} width={P} height={P} fill="#E87F5F" />
      <rect x={8} y={7} width={P} height={P} fill="#E87F5F" />
      <rect x={9} y={7} width={P} height={P} fill="#E87F5F" />
      <rect x={10} y={7} width={P} height={P} fill="#D16A4A" />
      <rect x={12} y={7} width={P} height={P} fill="#E87F5F" />
      {/* Body row 8 */}
      <rect x={5} y={8} width={P} height={P} fill="#E87F5F" />
      <rect x={6} y={8} width={P} height={P} fill="#F4A683" />
      <rect x={7} y={8} width={P} height={P} fill="#E87F5F" />
      <rect x={8} y={8} width={P} height={P} fill="#E87F5F" />
      <rect x={9} y={8} width={P} height={P} fill="#F4A683" />
      <rect x={10} y={8} width={P} height={P} fill="#E87F5F" />
      {/* Body row 9 - shell line */}
      <rect x={5} y={9} width={P} height={P} fill="#E87F5F" />
      <rect x={6} y={9} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={9} width={P} height={P} fill="#D16A4A" />
      <rect x={8} y={9} width={P} height={P} fill="#D16A4A" />
      <rect x={9} y={9} width={P} height={P} fill="#E87F5F" />
      <rect x={10} y={9} width={P} height={P} fill="#E87F5F" />
      {/* Body row 10 */}
      <rect x={5} y={10} width={P} height={P} fill="#D16A4A" />
      <rect x={6} y={10} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={10} width={P} height={P} fill="#E87F5F" />
      <rect x={8} y={10} width={P} height={P} fill="#E87F5F" />
      <rect x={9} y={10} width={P} height={P} fill="#E87F5F" />
      <rect x={10} y={10} width={P} height={P} fill="#D16A4A" />
      {/* Body row 11 */}
      <rect x={6} y={11} width={P} height={P} fill="#E87F5F" />
      <rect x={7} y={11} width={P} height={P} fill="#D16A4A" />
      <rect x={8} y={11} width={P} height={P} fill="#D16A4A" />
      <rect x={9} y={11} width={P} height={P} fill="#E87F5F" />
      {/* Body row 12 - tail start */}
      <rect x={6} y={12} width={P} height={P} fill="#D16A4A" />
      <rect x={7} y={12} width={P} height={P} fill="#E87F5F" />
      <rect x={8} y={12} width={P} height={P} fill="#E87F5F" />
      <rect x={9} y={12} width={P} height={P} fill="#D16A4A" />
    </svg>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const s = type==="error" ? {bg:"#7f1d1d",border:"#ef4444",color:"#fca5a5",icon:"✕"}
    : type==="success" ? {bg:"#14532d",border:"#22c55e",color:"#86efac",icon:"✓"}
    : {bg:"#1e293b",border:"#3b82f6",color:"#93c5fd",icon:"◈"};
  return (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,padding:"12px 20px",color:s.color,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:`0 8px 32px rgba(0,0,0,0.5),0 0 16px ${s.border}33`,animation:"slideUp 0.3s ease-out",maxWidth:"90vw",textAlign:"center",display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(8px)"}}>
      <span style={{fontSize:16}}>{s.icon}</span> {message}
    </div>
  );
}

function FallbackModal({ text, onClose }) {
  const taRef = useRef(null);
  const sel = () => { if(taRef.current){taRef.current.select();taRef.current.setSelectionRange(0,text.length);} };
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,boxSizing:"border-box",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f172a",border:"1px solid #334155",borderRadius:16,padding:24,width:"100%",maxWidth:480,display:"flex",flexDirection:"column",gap:14,animation:"fadeIn 0.2s ease-out"}}>
        <div style={{color:"#fbbf24",fontWeight:700,fontSize:15}}>📋 Tap the text, then copy</div>
        <p style={{color:"#64748b",fontSize:13,margin:0,lineHeight:1.6}}>Auto-copy isn't available. Tap inside → <strong style={{color:"#94a3b8"}}>Select All → Copy</strong>.</p>
        <textarea ref={taRef} readOnly defaultValue={text} onFocus={sel} onTouchStart={sel} onClick={sel} style={{background:"#020617",border:"1px solid #334155",borderRadius:8,color:"#e2e8f0",padding:14,fontSize:15,lineHeight:1.7,minHeight:160,resize:"none",fontFamily:"Georgia,serif",width:"100%",boxSizing:"border-box",WebkitUserSelect:"text",userSelect:"text"}} />
        <button onClick={onClose} className="tap-bounce" style={{background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:8,padding:"12px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
      </div>
    </div>
  );
}

function CopyButton({ text, label }) {
  const [state, setState] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const rip = useRipple();
  const handleCopy = async (e) => {
    rip(e);
    const r = await copyToClipboard(text);
    if(r==="ok"){setState("copied");setTimeout(()=>setState("idle"),2500);}
    else{setState("fallback");setShowModal(true);setTimeout(()=>setState("idle"),3000);}
  };
  const c = state==="copied"?{bg:"#166534",color:"#4ade80",border:"#22c55e"}:state==="fallback"?{bg:"#451a03",color:"#fbbf24",border:"#78350f"}:{bg:"#1e293b",color:"#94a3b8",border:"#334155"};
  return (
    <>
      <button onClick={handleCopy} className="btn-ripple tap-bounce focus-ring" style={{background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap",touchAction:"manipulation"}}>
        {state==="copied"?"✓ Copied!":state==="fallback"?"Tap to select ↗":(label||"Copy")}
      </button>
      {showModal && <FallbackModal text={text} onClose={()=>setShowModal(false)} />}
    </>
  );
}

function CharCounter({ count, limit, label }) {
  const pct = Math.min(count/limit,1);
  const color = count>limit?"#ef4444":count>limit*0.85?"#f59e0b":"#22c55e";
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#94a3b8"}}>
      {label && <span style={{minWidth:36}}>{label}</span>}
      <div style={{flex:1,height:4,background:"#1e293b",borderRadius:2,overflow:"hidden"}}>
        <div style={{width:`${pct*100}%`,height:"100%",background:color,borderRadius:2,transition:"width 0.3s",boxShadow:count>limit*0.85?`0 0 6px ${color}66`:"none"}} />
      </div>
      <span style={{color,fontWeight:600,minWidth:60,textAlign:"right",fontFamily:"monospace",fontSize:11}}>{count}/{limit}</span>
    </div>
  );
}

function PostCard({ label, content, charLimit, icon, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);
  const taRef = useRef(null);
  const rip = useRipple();
  useEffect(() => { setText(content); }, [content]);
  if (!content && !text) return null;
  const handleEdit = () => { setEditing(true); setTimeout(()=>{if(taRef.current){taRef.current.focus();taRef.current.setSelectionRange(text.length,text.length);}},50); };
  const handleSave = () => { setEditing(false); if(onEdit) onEdit(text); };
  const over = text.length > charLimit;
  return (
    <div className="hover-lift" style={{background:"linear-gradient(145deg,#0f172a,#0c1322)",border:`1px solid ${over?"#ef4444":"#1e293b"}`,borderRadius:14,padding:20,display:"flex",flexDirection:"column",gap:12,transition:"all 0.25s ease",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:20,right:20,height:1,background:over?"linear-gradient(90deg,transparent,#ef4444,transparent)":"linear-gradient(90deg,transparent,#1e293b,transparent)"}} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20,filter:"drop-shadow(0 0 4px rgba(59,130,246,0.3))"}}>{icon}</span>
          <span style={{color:"#e2e8f0",fontWeight:700,fontSize:14,fontFamily:"monospace",letterSpacing:"0.05em"}}>{label}</span>
          {over && <span style={{color:"#ef4444",fontSize:10,fontWeight:700,background:"#2d0a0a",padding:"2px 8px",borderRadius:4,animation:"pulse 1.5s infinite",letterSpacing:"0.05em"}}>OVER LIMIT</span>}
        </div>
        <div style={{display:"flex",gap:6}}>
          {!editing ? (
            <button onClick={e=>{rip(e);handleEdit();}} className="btn-ripple tap-bounce focus-ring hover-border" style={{background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,touchAction:"manipulation"}}>✏️ Edit</button>
          ) : (
            <button onClick={e=>{rip(e);handleSave();}} className="btn-ripple tap-bounce focus-ring" style={{background:"#166534",color:"#4ade80",border:"1px solid #22c55e",borderRadius:6,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,touchAction:"manipulation"}}>✓ Done</button>
          )}
          <CopyButton text={text} />
        </div>
      </div>
      {editing ? (
        <textarea ref={taRef} value={text} onChange={e=>setText(e.target.value)} className="focus-ring" style={{background:"#020617",border:`1px solid ${over?"#ef4444":"#334155"}`,borderRadius:8,color:"#e2e8f0",padding:16,fontSize:15,lineHeight:1.75,minHeight:120,resize:"vertical",fontFamily:"Georgia,serif",width:"100%",boxSizing:"border-box",outline:"none",transition:"border-color 0.3s"}} />
      ) : (
        <div onClick={handleEdit} className="hover-border" style={{background:"#020617",borderRadius:8,padding:16,color:"#cbd5e1",fontSize:15,lineHeight:1.75,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif",cursor:"text",WebkitUserSelect:"text",userSelect:"text",border:"1px solid transparent",transition:"all 0.2s"}}>{text}</div>
      )}
      <CharCounter count={text.length} limit={charLimit} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,alignItems:"center"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"32px 24px",background:"linear-gradient(145deg,#0f172a,#0c1322)",border:"1px solid #1e293b",borderRadius:16,width:"100%",boxSizing:"border-box",animation:"glow 2s ease-in-out infinite"}}>
        <ClaudeLobster size={64} animate={true} />
        <div style={{color:"#94a3b8",fontSize:13,fontWeight:600,letterSpacing:"0.03em"}}>Crafting your posts…</div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:3,background:"#3b82f6",animation:`pulse 1s ease-in-out infinite ${i*0.2}s`}} />)}
        </div>
      </div>
      {[1,2].map(i=>(
        <div key={i} style={{background:"linear-gradient(145deg,#0f172a,#0c1322)",border:"1px solid #1e293b",borderRadius:14,padding:20,width:"100%",boxSizing:"border-box"}}>
          {[1,0.75,0.5].map((_,j)=><div key={j} style={{height:12,width:`${_*100}%`,borderRadius:6,marginBottom:12,background:"linear-gradient(90deg,#1e293b 25%,#2a3a52 50%,#1e293b 75%)",backgroundSize:"400px 100%",animation:`shimmer 1.5s infinite linear ${j*0.15}s`}} />)}
        </div>
      ))}
    </div>
  );
}

function ModelSelector({ model, setModel, thinking, setThinking }) {
  const rip = useRipple();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <label style={{color:"#64748b",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>Model</label>
        <div style={{display:"flex",gap:6,flex:1,flexWrap:"wrap"}}>
          {MODELS.map(m=>{
            const act=model===m.id;
            return (
              <button key={m.id} onClick={e=>{rip(e);setModel(m.id);}} className={`btn-ripple tap-bounce focus-ring ${act?"":"hover-glow"}`} style={{padding:"8px 16px",borderRadius:10,border:"1px solid",borderColor:act?"#3b82f6":"#1e293b",background:act?"linear-gradient(135deg,#1d3461,#172554)":"#0f172a",color:act?"#93c5fd":"#64748b",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:act?700:500,touchAction:"manipulation",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6,boxShadow:act?"0 0 12px rgba(59,130,246,0.15)":"none"}}>
                <span style={{fontSize:14}}>{m.icon}</span><span>{m.label}</span><span style={{fontSize:10,color:act?"#60a5fa":"#475569",fontWeight:400}}>({m.desc})</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <label style={{color:"#64748b",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",minWidth:36}}>Think</label>
        <button onClick={e=>{rip(e);setThinking(!thinking);}} className="btn-ripple tap-bounce focus-ring" style={{width:48,height:26,borderRadius:13,border:"1px solid",padding:2,cursor:"pointer",background:thinking?"linear-gradient(135deg,#7c3aed,#a855f7)":"#1e293b",borderColor:thinking?"#a855f7":"#334155",transition:"all 0.3s ease",display:"flex",alignItems:"center",boxShadow:thinking?"0 0 12px rgba(168,85,247,0.3)":"none"}}>
          <div style={{width:20,height:20,borderRadius:10,background:thinking?"#fff":"#475569",transform:thinking?"translateX(22px)":"translateX(0)",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:thinking?"0 1px 4px rgba(0,0,0,0.3)":"none"}} />
        </button>
        <span style={{color:thinking?"#c4b5fd":"#475569",fontSize:12,fontWeight:thinking?600:400,transition:"all 0.2s"}}>
          Extended Thinking {thinking && <span style={{color:"#a855f7",fontSize:10}}>(deeper reasoning)</span>}
        </span>
      </div>
    </div>
  );
}

function HistoryPanel({ history, onSelect, onClose }) {
  const rip = useRipple();
  if (!history.length) return (
    <div style={{padding:24,textAlign:"center",color:"#475569",fontSize:13}}>
      <span style={{fontSize:24,display:"block",marginBottom:8,opacity:0.5}}>📋</span>
      No posts generated yet. Your history will appear here.
    </div>
  );
  return (
    <div className="scrollbar-thin" style={{display:"flex",flexDirection:"column",gap:8,padding:"8px 0",maxHeight:300,overflowY:"auto"}}>
      {history.map((item,i)=>(
        <button key={i} onClick={e=>{rip(e);onSelect(item);onClose();}} className="btn-ripple tap-bounce hover-glow focus-ring" style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",flexDirection:"column",gap:6,transition:"all 0.2s",touchAction:"manipulation",position:"relative",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#3b82f6",fontSize:11,fontWeight:700}}>{item.inputs.topic} · {item.inputs.tone}</span>
            <span style={{color:"#334155",fontSize:10,fontFamily:"monospace"}}>{item.timestamp}</span>
          </div>
          <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.inputs.content.slice(0,120)}{item.inputs.content.length>120?"…":""}</div>
          <div style={{color:"#475569",fontSize:11}}>𝕏 {item.result.twitter.length} chars · 🧵 {item.result.threads.length} chars</div>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SocialPostGenerator() {
  const [topic,setTopic]=useState("Technology");
  const [customTopic,setCustom]=useState("");
  const [tone,setTone]=useState("Professional");
  const [hookType,setHookType]=useState("Bold Statement");
  const [content,setContent]=useState("");
  const [url,setUrl]=useState("");
  const [model,setModel]=useState(MODELS[0].id);
  const [thinking,setThinking]=useState(false);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [toast,setToast]=useState(null);
  const [history,setHistory]=useState([]);
  const [showHistory,setShowHistory]=useState(false);
  const [showPresets,setShowPresets]=useState(false);
  const resultsRef=useRef(null);
  const rip=useRipple();

  useEffect(()=>{
    const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();document.getElementById("generate-btn")?.click();}};
    window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h);
  },[]);

  const showToast=(msg,type="info")=>setToast({message:msg,type});

  const generate=useCallback(async()=>{
    if(!content.trim()){showToast("Please enter your topic or key message.","error");return;}
    setLoading(true);setResult(null);
    const topicLabel=topic==="Custom"?customTopic:topic;
    const userPrompt=`Create social media posts about the following:\n\nTOPIC CATEGORY: ${topicLabel}\nDESIRED TONE: ${tone}\nPREFERRED HOOK TYPE: ${hookType}\nKEY MESSAGE / CONTENT:\n${content}${url?`\n\nSOURCE URL: ${url}`:""}\n\nGenerate both Twitter/X and Threads versions following all rules exactly.`;
    const body={model,max_tokens:thinking?16000:1000,messages:[{role:"user",content:thinking?(SYSTEM_PROMPT+"\n\n---\n\n"+userPrompt):userPrompt}]};
    if(thinking){body.thinking={type:"enabled",budget_tokens:10000};}else{body.system=SYSTEM_PROMPT;}
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      let rawText="";
      if(data.content){for(const block of data.content){if(block.type==="text"){rawText=block.text;break;}}}
      const parsed=parseOutput(rawText);
      setResult(parsed);
      const entry={inputs:{topic:topicLabel,tone,hookType,content,url},result:parsed,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),model:MODELS.find(m=>m.id===model)?.label||model};
      setHistory(prev=>[entry,...prev].slice(0,20));
      showToast("Posts generated!","success");
      setTimeout(()=>{resultsRef.current?.scrollIntoView({behavior:"smooth",block:"start"});},100);
    }catch(e){showToast("Generation failed: "+e.message,"error");}finally{setLoading(false);}
  },[topic,customTopic,tone,hookType,content,url,model,thinking]);

  const applyPreset=p=>{setTopic(p.topic);setTone(p.tone);setHookType(p.hook);setContent(p.content);setShowPresets(false);showToast(`Preset loaded: ${p.label}`,"info");};
  const loadHistoryItem=item=>{setTopic(item.inputs.topic);setTone(item.inputs.tone);setHookType(item.inputs.hookType);setContent(item.inputs.content);setUrl(item.inputs.url||"");setResult(item.result);};
  const copyAll=async()=>{if(!result)return;const combined=`TWITTER/X:\n${result.twitter}\n\nTHREADS:\n${result.threads}${result.hashtags?`\n\nHASHTAGS: ${result.hashtags}`:""}`; const r=await copyToClipboard(combined);if(r==="ok")showToast("Both posts copied!","success");else showToast("Couldn't auto-copy. Try individually.","error");};

  const inputStyle={background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0",padding:"12px 14px",fontSize:16,fontFamily:"inherit",width:"100%",boxSizing:"border-box",outline:"none",appearance:"none",WebkitAppearance:"none",transition:"border-color 0.2s"};
  const labelStyle={color:"#64748b",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6,display:"block"};
  const pill=act=>({padding:"7px 14px",borderRadius:20,border:"1px solid",borderColor:act?"#3b82f6":"#1e293b",background:act?"linear-gradient(135deg,#1d3461,#172554)":"#0f172a",color:act?"#93c5fd":"#64748b",fontSize:13,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit",fontWeight:act?600:400,touchAction:"manipulation",boxShadow:act?"0 0 8px rgba(59,130,246,0.1)":"none"});
  const toolbarBtn=act=>({background:act?"#172554":"#0f172a",border:`1px solid ${act?"#3b82f6":"#1e293b"}`,borderRadius:10,padding:"9px 16px",color:act?"#93c5fd":"#94a3b8",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",gap:6,touchAction:"manipulation",transition:"all 0.2s",position:"relative",overflow:"hidden",boxShadow:act?"0 0 12px rgba(59,130,246,0.1)":"none"});

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#020617 0%,#0a0f1e 50%,#020617 100%)",color:"#e2e8f0",fontFamily:"'DM Sans','Segoe UI',sans-serif",padding:"32px 16px"}}>
      <style>{ALL_CSS}</style>
      <div style={{maxWidth:720,margin:"0 auto"}}>

        {/* Header */}
        <div style={{marginBottom:28,textAlign:"center"}}>
          <div style={{fontSize:10,letterSpacing:"0.25em",color:"#3b82f6",fontWeight:700,textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{width:24,height:1,background:"linear-gradient(90deg,transparent,#3b82f6)"}} />
            SOCIAL POST GENERATOR
            <span style={{width:24,height:1,background:"linear-gradient(90deg,#3b82f6,transparent)"}} />
          </div>
          <h1 style={{fontSize:"clamp(26px,5vw,40px)",fontWeight:800,margin:0,lineHeight:1.15,background:"linear-gradient(135deg,#f1f5f9 0%,#94a3b8 50%,#f1f5f9 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em"}}>Posts That Sound Human</h1>
          <p style={{color:"#475569",marginTop:10,fontSize:13,letterSpacing:"0.02em"}}>Twitter/X · Threads · Edit in place · Powered by Claude</p>
        </div>

        {/* Toolbar */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <button style={toolbarBtn(showPresets)} onClick={e=>{rip(e);setShowPresets(!showPresets);setShowHistory(false);}} className="btn-ripple tap-bounce focus-ring">⚡ Presets</button>
          <button style={toolbarBtn(showHistory)} onClick={e=>{rip(e);setShowHistory(!showHistory);setShowPresets(false);}} className="btn-ripple tap-bounce focus-ring">
            📋 History
            {history.length>0 && <span style={{background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px",minWidth:16,textAlign:"center"}}>{history.length}</span>}
          </button>
          <div style={{flex:1}} />
          <span style={{color:"#1e293b",fontSize:11,fontFamily:"monospace"}}>⌘+Enter</span>
        </div>

        {/* Presets */}
        {showPresets && (
          <div style={{background:"linear-gradient(145deg,#0a1628,#0c1322)",border:"1px solid #1e293b",borderRadius:14,padding:14,marginBottom:16,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:8,animation:"fadeIn 0.2s ease-out"}}>
            {PRESETS.map((p,i)=><button key={i} onClick={e=>{rip(e);applyPreset(p);}} className="btn-ripple tap-bounce hover-glow focus-ring" style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:"12px 14px",color:"#94a3b8",fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.2s",touchAction:"manipulation",position:"relative",overflow:"hidden"}}>{p.label}</button>)}
          </div>
        )}

        {/* History */}
        {showHistory && (
          <div style={{background:"linear-gradient(145deg,#0a1628,#0c1322)",border:"1px solid #1e293b",borderRadius:14,padding:14,marginBottom:16,animation:"fadeIn 0.2s ease-out"}}>
            <HistoryPanel history={history} onSelect={loadHistoryItem} onClose={()=>setShowHistory(false)} />
          </div>
        )}

        {/* Form */}
        <div style={{display:"flex",flexDirection:"column",gap:22,background:"linear-gradient(145deg,#0a1628,#080e1c)",border:"1px solid #1e293b",borderRadius:18,padding:"28px 22px",marginBottom:24,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:"radial-gradient(circle at top right,rgba(59,130,246,0.06),transparent 70%)",pointerEvents:"none"}} />

          <ModelSelector model={model} setModel={setModel} thinking={thinking} setThinking={setThinking} />
          <div style={{height:1,background:"linear-gradient(90deg,transparent,#1e293b,transparent)"}} />

          <div>
            <label style={labelStyle}>Topic Category</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {TOPICS.map(t=><button key={t} style={pill(topic===t)} onClick={e=>{rip(e);setTopic(t);}} className="btn-ripple tap-bounce focus-ring">{t}</button>)}
            </div>
            {topic==="Custom" && <input style={{...inputStyle,marginTop:10}} className="focus-ring" placeholder="Enter your custom topic..." value={customTopic} onChange={e=>setCustom(e.target.value)} />}
          </div>

          <div>
            <label style={labelStyle}>Tone</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {TONES.map(t=><button key={t} style={pill(tone===t)} onClick={e=>{rip(e);setTone(t);}} className="btn-ripple tap-bounce focus-ring">{t}</button>)}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Hook Technique</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {HOOK_TYPES.map(h=><button key={h} style={pill(hookType===h)} onClick={e=>{rip(e);setHookType(h);}} className="btn-ripple tap-bounce focus-ring">{h}</button>)}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Your Key Message or Content</label>
            <textarea style={{...inputStyle,minHeight:130,resize:"vertical",lineHeight:1.6}} className="focus-ring" placeholder="Paste an article summary, idea, insight, announcement, or talking point. The more specific, the better the output." value={content} onChange={e=>setContent(e.target.value)} />
            <div style={{marginTop:6}}><CharCounter count={content.length} limit={2000} label="Input" /></div>
          </div>

          <div>
            <label style={labelStyle}>Source URL <span style={{color:"#475569",textTransform:"none",letterSpacing:0}}>(optional)</span></label>
            <input style={inputStyle} className="focus-ring" type="url" inputMode="url" placeholder="https://..." value={url} onChange={e=>setUrl(e.target.value)} />
          </div>

          <button id="generate-btn" onClick={e=>{rip(e);generate();}} disabled={loading} className="btn-ripple tap-bounce focus-ring" style={{background:loading?"#1e293b":"linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#2563eb 100%)",color:loading?"#475569":"#fff",border:"none",borderRadius:12,padding:"18px 24px",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",transition:"all 0.2s",letterSpacing:"0.02em",fontFamily:"inherit",WebkitAppearance:"none",appearance:"none",touchAction:"manipulation",position:"relative",overflow:"hidden",boxShadow:loading?"none":"0 4px 16px rgba(59,130,246,0.25)"}}>
            {loading ? (
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <ClaudeLobster size={22} animate={true} />
                Generating{thinking?" (thinking)…":"…"}
              </span>
            ) : (
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <ClaudeLobster size={20} animate={false} />
                Generate Posts
              </span>
            )}
          </button>
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef} style={{display:"flex",flexDirection:"column",gap:16,animation:"fadeIn 0.3s ease-out"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{color:"#475569",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700}}>◈ Generated Posts</div>
                {history[0]?.model && <span style={{fontSize:10,color:"#334155",fontFamily:"monospace",background:"#0f172a",padding:"2px 8px",borderRadius:4,border:"1px solid #1e293b"}}>via {history[0].model}</span>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={e=>{rip(e);copyAll();}} className="btn-ripple tap-bounce focus-ring hover-border" style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:"8px 14px",color:"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",gap:6,touchAction:"manipulation",transition:"all 0.2s"}}>📋 Copy Both</button>
                <button onClick={e=>{rip(e);generate();}} disabled={loading} className="btn-ripple tap-bounce focus-ring hover-glow" style={{background:"#0f172a",border:"1px solid #1d4ed8",borderRadius:8,padding:"8px 14px",color:"#93c5fd",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",gap:6,touchAction:"manipulation",transition:"all 0.2s"}}>🔄 Regenerate</button>
              </div>
            </div>

            <PostCard label="TWITTER / X" content={result.twitter} charLimit={280} icon="𝕏" onEdit={t=>setResult(p=>({...p,twitter:t}))} />
            <PostCard label="THREADS" content={result.threads} charLimit={500} icon="🧵" onEdit={t=>setResult(p=>({...p,threads:t}))} />

            {(result.hashtags||result.source||result.hook) && (
              <div className="hover-lift" style={{background:"linear-gradient(145deg,#0a1628,#0c1322)",border:"1px solid #1e293b",borderRadius:14,padding:20,display:"flex",flexDirection:"column",gap:10}}>
                {result.hashtags && <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13}}><span style={{color:"#475569",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Hashtags · </span><span style={{color:"#3b82f6"}}>{result.hashtags}</span></div><CopyButton text={result.hashtags} label="Copy Tags" /></div>}
                {result.source && <div style={{fontSize:13}}><span style={{color:"#475569",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Source · </span><span style={{color:"#cbd5e1"}}>{result.source}</span></div>}
                {result.hook && <div style={{fontSize:13}}><span style={{color:"#475569",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Hook · </span><span style={{color:"#a78bfa"}}>{result.hook}</span></div>}
              </div>
            )}

            <button onClick={()=>{setResult(null);window.scrollTo({top:0,behavior:"smooth"});}} className="tap-bounce hover-border focus-ring" style={{background:"transparent",border:"1px solid #1e293b",color:"#475569",borderRadius:10,padding:"14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",touchAction:"manipulation",transition:"all 0.2s"}}>← Start Over</button>
          </div>
        )}

        <div style={{marginTop:40,paddingTop:20,borderTop:"1px solid #0f172a",textAlign:"center"}}>
          <p style={{color:"#1e293b",fontSize:11,letterSpacing:"0.05em"}}>Built with Claude · v3.0</p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onDone={()=>setToast(null)} />}
    </div>
  );
}

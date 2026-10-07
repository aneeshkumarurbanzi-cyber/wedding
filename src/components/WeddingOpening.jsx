"use client";

import { useEffect, useRef, useState } from "react";

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap");

.wd-root{
  --ivory:#f8f2e8;--ink:#2b2523;--mute:#7b6f66;--gold:#b8975a;--sage:#5d6b57;
  --serif:"Cormorant Garamond",Georgia,serif;--sans:"Jost",system-ui,sans-serif;
  position:fixed;inset:0;z-index:9999;overflow:hidden;font-family:var(--sans);font-weight:300;color:var(--ink);
  background:linear-gradient(160deg,#f1ddd5,var(--ivory) 50%,#e3e9db) var(--ivory)
}
.wd-root *{box-sizing:border-box}
.wd-fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5}

/* Card */
.wd-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(88vw,400px);height:min(80vh,640px);height:min(80svh,640px);
  background:var(--ivory);overflow:hidden;z-index:1;display:grid;place-items:center;
  box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 30px 80px rgba(70,45,35,.2),0 2px 6px rgba(70,45,35,.1);
  animation:wd-paper 1.2s ease backwards}
.wd-open .wd-card{width:100vw;height:100vh;height:100svh;box-shadow:none;
  transition:width 1.5s cubic-bezier(.7,0,.2,1) .9s,height 1.5s cubic-bezier(.7,0,.2,1) .9s,box-shadow .8s .9s}

/* Gold frame */
.wd-ln{position:absolute;background:var(--gold);z-index:1}
.wd-ln.t,.wd-ln.b{left:16px;right:16px;height:1px}.wd-ln.l,.wd-ln.r{top:16px;bottom:16px;width:1px}
.wd-ln.t{top:16px;transform-origin:left;animation:wd-sx 1.6s cubic-bezier(.6,0,.2,1) .4s backwards}
.wd-ln.b{bottom:16px;transform-origin:right;animation:wd-sx 1.6s cubic-bezier(.6,0,.2,1) .4s backwards}
.wd-ln.l{left:16px;transform-origin:top;animation:wd-sy 1.6s cubic-bezier(.6,0,.2,1) .4s backwards}
.wd-ln.r{right:16px;transform-origin:bottom;animation:wd-sy 1.6s cubic-bezier(.6,0,.2,1) .4s backwards}
.wd-inner{position:absolute;inset:23px;border:1px solid rgba(184,151,90,.3);animation:wd-fin 1.4s ease 1.8s backwards}

/* Sprigs */
.wd-sprig{position:absolute;width:150px;height:170px;z-index:1;overflow:visible;pointer-events:none}
.wd-sprig.a{top:6px;left:6px}.wd-sprig.z{bottom:6px;right:6px;transform:rotate(180deg)}
.wd-stem,.wd-lf{fill:none;stroke:var(--sage);stroke-width:1.2;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0;
  animation:wd-draw 1.8s cubic-bezier(.5,0,.2,1) .8s backwards}
.wd-lf{fill:var(--sage);fill-opacity:.18;
  animation:wd-draw 1s ease calc(1.2s + var(--k)*.13s) backwards,wd-fo 1s ease calc(1.8s + var(--k)*.13s) backwards}

/* Cover */
.wd-cover{position:relative;z-index:2;display:grid;justify-items:center;gap:14px;text-align:center;padding:0 44px;transition:opacity .7s ease .1s,visibility 0s .9s}
.wd-cover>*{margin:0}
.wd-lead{font:italic 300 1.2rem var(--serif);color:var(--mute);animation:wd-rise 1.4s ease 1.4s backwards}
.wd-names{margin:0;font:300 clamp(3rem,14vw,4.8rem)/.95 var(--serif)}
.wd-names i{display:block;font-size:.4em;color:var(--gold);margin:.3em 0}
.wd-cover .wd-names{animation:wd-rise 1.6s ease 1.8s backwards}
.wd-date{font-size:.92rem;letter-spacing:.14em;color:var(--mute);animation:wd-rise 1.4s ease 2.4s backwards}
.wd-open .wd-cover{opacity:0;visibility:hidden;pointer-events:none}

.wd-seal{position:relative;margin-top:18px;width:78px;height:78px;border-radius:50%;border:1px solid var(--gold);background:transparent;cursor:pointer;
  color:var(--ink);font:italic 400 1.5rem var(--serif);display:grid;place-items:center;animation:wd-rise 1.4s ease 3s backwards;
  transition:transform .8s ease,opacity .6s,background .3s;-webkit-tap-highlight-color:transparent}
.wd-seal::before{content:"";position:absolute;inset:5px;border-radius:50%;border:1px solid rgba(184,151,90,.45)}
.wd-seal::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid var(--gold);opacity:0;animation:wd-ping 2.4s ease-out 4s infinite}
.wd-seal:hover{background:rgba(184,151,90,.1)}
.wd-seal:focus-visible{outline:2px solid var(--gold);outline-offset:5px}
.wd-open .wd-seal{transform:scale(1.5);opacity:0}
.wd-hint{font-size:.85rem;color:var(--mute);animation:wd-rise 1.4s ease 3.4s backwards}

/* Invitation */
.wd-invite{position:absolute;inset:0;z-index:2;display:grid;place-content:center;justify-items:center;gap:14px;text-align:center;padding:0 44px}
.wd-invite>*{margin:0;opacity:0;transform:translateY(12px);transition:opacity .3s,transform .3s}
.wd-open .wd-invite>*{opacity:1;transform:none;transition:opacity 1.2s calc(2.2s + var(--i)*.16s),transform 1.2s calc(2.2s + var(--i)*.16s)}
.wd-sm{font:italic 300 1.2rem var(--serif);color:var(--mute)}
.wd-invite .wd-names{font-size:clamp(3.2rem,15vw,5.8rem)}
.wd-rule{width:64px;height:1px;background:var(--gold)}
.wd-inv{font:italic 300 1.25rem/1.5 var(--serif);color:var(--mute)}
.wd-invite .wd-date{animation:none;font:400 1rem var(--sans);letter-spacing:.1em;color:var(--ink)}
.wd-count{display:flex;gap:clamp(16px,5vw,32px);margin-top:2px}
.wd-u b{display:block;font:300 clamp(1.8rem,7vw,2.6rem)/1 var(--serif);font-variant-numeric:tabular-nums}
.wd-u span{font-size:.78rem;color:var(--mute)}
.wd-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.wd-btn{padding:12px 30px;border:1px solid var(--gold);background:transparent;color:var(--ink);text-decoration:none;cursor:pointer;
  font:400 .9rem var(--sans);letter-spacing:.06em;transition:background .4s,color .4s}
.wd-btn:hover{background:var(--gold);color:var(--ivory)}
.wd-btn:focus-visible{outline:2px solid var(--gold);outline-offset:4px}

@keyframes wd-paper{from{opacity:0;transform:translate(-50%,-46%)}to{opacity:1;transform:translate(-50%,-50%)}}
@keyframes wd-sx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes wd-sy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes wd-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes wd-fo{from{fill-opacity:0}to{fill-opacity:.18}}
@keyframes wd-fin{from{opacity:0}to{opacity:1}}
@keyframes wd-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes wd-ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.9);opacity:0}}
@media (prefers-reduced-motion:reduce){
  .wd-root *,.wd-root *::before,.wd-root *::after{animation-duration:.01s!important;animation-delay:0s!important;transition-duration:.01s!important;transition-delay:0s!important}
}
`;

/* One curved stem with leaves on both sides */
const bez = (t, p) => {
  const u = 1 - t;
  return [0, 1].map(
    (i) => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]
  );
};
const CURVE = [[10, 150], [18, 100], [50, 60], [112, 12]];
const LEAVES = (() => {
  const out = [];
  let i = 0;
  for (let t = 0.1; t < 0.95; t += 0.09, i++) {
    const [x, y] = bez(t, CURVE);
    const [x2, y2] = bez(t + 0.01, CURVE);
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const s = 1.15 - t * 0.5;
    [-1, 1].forEach((side, j) =>
      out.push({
        k: i * 2 + j,
        transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side * 48).toFixed(1)}) scale(${s.toFixed(2)})`,
      })
    );
  }
  return out;
})();

function Sprig({ className }) {
  return (
    <svg className={`wd-sprig ${className}`} viewBox="0 0 120 160" aria-hidden="true">
      <path className="wd-stem" pathLength="1" d="M10 150C18 100 50 60 112 12" />
      {LEAVES.map((l) => (
        <path
          key={l.k}
          className="wd-lf"
          pathLength="1"
          d="M0 0C7 -7 17 -7 26 0C17 7 7 7 0 0Z"
          transform={l.transform}
          style={{ "--k": l.k }}
        />
      ))}
    </svg>
  );
}

const pad = (n) => String(n).padStart(2, "0");

export default function WeddingOpening({
  groom = "Groom",
  bride = "Bride",
  dateShort = "12 · 12 · 2026",
  dateLong = "Saturday, 12 December 2026",
  weddingDate = "2026-12-12T00:00:00",
  calendarDates = "20261212/20261213", // YYYYMMDD/YYYYMMDD (end is the day after)
  onOpen, // optional: shows an "Enter" button that calls this, e.g. to remove the overlay
}) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const canvasRef = useRef(null);
  const inviteRef = useRef(null);
  const spawnRef = useRef(() => {});
  const timer = useRef(null);

  /* Keep the hidden invitation out of the tab order until opened */
  useEffect(() => {
    if (inviteRef.current) inviteRef.current.inert = !open;
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  /* Countdown */
  useEffect(() => {
    const target = new Date(weddingDate).getTime();
    const tick = () => {
      const s = Math.floor(Math.max(0, target - Date.now()) / 1000);
      setLeft({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  /* Gold dust always; petals after opening */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf;
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const motes = Array.from({ length: 34 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4, vy: Math.random() * 0.22 + 0.06, ph: Math.random() * 6.28,
    }));
    let petals = [];
    const cols = ["#e9cfc6", "#d9a99f", "#b8975a", "#8c9a82"];
    const mk = (init) => ({
      x: Math.random() * w, y: init ? -Math.random() * h : -20, s: 5 + Math.random() * 5,
      vy: 0.5 + Math.random() * 0.8, sw: Math.random() * 6.28, rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.03, fl: Math.random() * 6.28,
      col: cols[Math.floor(Math.random() * cols.length)],
    });
    spawnRef.current = (n) => { petals = Array.from({ length: n }, () => mk(true)); };

    const frame = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w; }
        ctx.fillStyle = `rgba(184,151,90,${0.1 + 0.3 * ((Math.sin(t * 0.0012 + m.ph) + 1) / 2)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, 6.28);
        ctx.fill();
      }
      for (const p of petals) {
        p.y += p.vy; p.sw += 0.02; p.x += Math.sin(p.sw) * 0.6; p.rot += p.vr; p.fl += 0.04;
        if (p.y > h + 20) Object.assign(p, mk(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.25 + Math.abs(Math.cos(p.fl)) * 0.75);
        ctx.fillStyle = p.col;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    timer.current = setTimeout(() => spawnRef.current(26), 1600);
  };

  const calHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent(`${groom} & ${bride}'s Wedding`) +
    "&dates=" + encodeURIComponent(calendarDates);

  return (
    <div className={`wd-root ${open ? "wd-open" : ""}`} role="dialog" aria-label="Wedding invitation">
      <style>{CSS}</style>

      <main className="wd-card">
        <span className="wd-ln t" /><span className="wd-ln b" /><span className="wd-ln l" /><span className="wd-ln r" />
        <span className="wd-inner" />
        <Sprig className="a" />
        <Sprig className="z" />

        <section className="wd-cover">
          <p className="wd-lead">We're getting married</p>
          <h1 className="wd-names">{groom}<i>&amp;</i>{bride}</h1>
          <p className="wd-date">{dateShort}</p>
          <button type="button" className="wd-seal" onClick={handleOpen} aria-label="Open the invitation">
            {(groom[0] || "") + "&" + (bride[0] || "")}
          </button>
          <p className="wd-hint">Touch the seal to open</p>
        </section>

        <section className="wd-invite" ref={inviteRef}>
          <p className="wd-sm" style={{ "--i": 0 }}>Together with their families</p>
          <h2 className="wd-names" style={{ "--i": 1 }}>{groom}<i>&amp;</i>{bride}</h2>
          <span className="wd-rule" style={{ "--i": 2 }} />
          <p className="wd-inv" style={{ "--i": 3 }}>invite you to celebrate their wedding on</p>
          <p className="wd-date" style={{ "--i": 4 }}>{dateLong}</p>
          <div className="wd-count" style={{ "--i": 5 }} role="timer" aria-label="Time until the wedding">
            <div className="wd-u"><b>{left.d}</b><span>days</span></div>
            <div className="wd-u"><b>{pad(left.h)}</b><span>hours</span></div>
            <div className="wd-u"><b>{pad(left.m)}</b><span>minutes</span></div>
            <div className="wd-u"><b>{pad(left.s)}</b><span>seconds</span></div>
          </div>
          <div className="wd-actions" style={{ "--i": 6 }}>
            <a className="wd-btn" href={calHref} target="_blank" rel="noopener noreferrer">Add to calendar</a>
            {onOpen && (
              <button type="button" className="wd-btn" onClick={onOpen}>Enter</button>
            )}
          </div>
        </section>
      </main>

      <canvas ref={canvasRef} className="wd-fx" aria-hidden="true" />
    </div>
  );
}

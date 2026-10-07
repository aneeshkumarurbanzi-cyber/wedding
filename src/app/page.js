"use client";
 
import { useEffect, useRef, useState } from "react";
import WeddingOpening from "../components/WeddingOpening";
 
/* ================================================================
   EDIT EVERYTHING HERE. All text below is placeholder content.
   ================================================================ */
const COUPLE = { groom: "Aneesh", bride: "Bride" };
 
const STORY = [
  { year: "2019", title: "How we met", text: "Write a few lines about how the two of you first met." },
  { year: "2022", title: "The moment we knew", text: "Write about the moment you realised this was the one." },
  { year: "2026", title: "The proposal", text: "Write about the proposal, or how the families came together." },
];
 
const EVENTS = [
  { name: "Wedding ceremony", date: "Saturday, 12 December 2026", time: "10:00 AM", place: "Venue name", note: "Please be seated by 9:45 AM." },
  { name: "Reception", date: "Saturday, 12 December 2026", time: "6:30 PM", place: "Venue name", note: "Dinner and celebrations to follow." },
];
 
const VENUE = {
  name: "Venue name",
  address: "Street, City, Kerala, India",
  mapQuery: "Thiruvananthapuram, Kerala", // replace with the venue name + city
  notes: "Add parking, landmark or travel tips here.",
};
 
// Country code + number, no + or spaces. RSVPs are sent to this WhatsApp number.
const RSVP_WHATSAPP = "91XXXXXXXXXX";
const RSVP_BY = "1 December 2026";
 
/* ================================================================ */
 
const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap");
.wp{--ivory:#f8f2e8;--ink:#2b2523;--mute:#6f645b;--gold:#b8975a;--sage:#5d6b57;
  --serif:"Cormorant Garamond",Georgia,serif;--sans:"Jost",system-ui,sans-serif;
  font-family:var(--sans);font-weight:300;color:var(--ink);background:var(--ivory)}
.wp-serif{font-family:var(--serif)}
.wp-reveal{opacity:0;transform:translateY(18px);transition:opacity 1s ease,transform 1s ease}
.wp-reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.wp-reveal{opacity:1;transform:none;transition:none}}
.wp input,.wp select,.wp textarea{font:inherit}
.wp :focus-visible{outline:2px solid var(--gold);outline-offset:3px}
`;
 
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`wp-reveal ${seen ? "in" : ""} ${className}`}>{children}</div>;
}
 
function Heading({ kicker, children }) {
  return (
    <div className="mb-12 text-center">
      <p className="wp-serif text-xl italic text-[var(--mute)]">{kicker}</p>
      <h2 className="wp-serif mt-1 text-5xl font-light sm:text-6xl">{children}</h2>
      <span className="mx-auto mt-5 block h-px w-16 bg-[var(--gold)]" />
    </div>
  );
}
 
function Rsvp() {
  const [form, setForm] = useState({ name: "", attending: "yes", guests: "1", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
 
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Please enter your name."); return; }
    setError("");
    const text = [
      `RSVP for ${COUPLE.groom} & ${COUPLE.bride}'s wedding`,
      `Name: ${form.name.trim()}`,
      `Attending: ${form.attending === "yes" ? "Yes, joyfully" : "Sorry, can't make it"}`,
      form.attending === "yes" ? `Guests: ${form.guests}` : null,
      form.message.trim() ? `Message: ${form.message.trim()}` : null,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
  };
 
  if (sent) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="wp-serif text-4xl font-light">Thank you, {form.name.split(" ")[0]}.</p>
        <p className="mt-3 text-[var(--mute)]">
          Your reply is ready in WhatsApp. If it didn't open, tap send there to finish.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 text-sm underline underline-offset-4 text-[var(--mute)]">
          Edit my reply
        </button>
      </div>
    );
  }
 
  const field = "w-full border border-[var(--gold)]/50 bg-transparent px-4 py-3 text-base";
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-5" noValidate>
      <label className="grid gap-2 text-sm">
        Your name
        <input className={field} value={form.name} onChange={set("name")} autoComplete="name" required />
      </label>
 
      <fieldset className="grid gap-2 text-sm">
        <legend className="mb-2">Will you attend?</legend>
        <div className="grid grid-cols-2 gap-3">
          {[["yes", "Joyfully accept"], ["no", "Regretfully decline"]].map(([v, label]) => (
            <label key={v} className={`cursor-pointer border px-3 py-3 text-center text-base transition-colors ${
              form.attending === v ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ivory)]" : "border-[var(--gold)]/50"}`}>
              <input type="radio" name="attending" value={v} checked={form.attending === v} onChange={set("attending")} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
 
      {form.attending === "yes" && (
        <label className="grid gap-2 text-sm">
          Number of guests (including you)
          <select className={field} value={form.guests} onChange={set("guests")}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
 
      <label className="grid gap-2 text-sm">
        A message for the couple (optional)
        <textarea className={field} rows={3} value={form.message} onChange={set("message")} />
      </label>
 
      {error && <p role="alert" className="text-sm text-[#a3342f]">{error}</p>}
 
      <button type="submit" className="border border-[var(--gold)] px-8 py-3.5 text-base tracking-wide transition-colors hover:bg-[var(--gold)] hover:text-[var(--ivory)]">
        Send RSVP on WhatsApp
      </button>
    </form>
  );
}
 
export default function Page() {
  const [showOpening, setShowOpening] = useState(true);
 
  useEffect(() => {
    document.body.style.overflow = showOpening ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showOpening]);
 
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(VENUE.mapQuery)}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.mapQuery)}`;
  const link = "text-sm text-[var(--mute)] transition-colors hover:text-[var(--ink)]";
 
  return (
    <>
      <style>{CSS}</style>
 
      {showOpening && (
        <WeddingOpening
          groom={COUPLE.groom}
          bride={COUPLE.bride}
          onOpen={() => setShowOpening(false)}
        />
      )}
 
      <div className="wp min-h-screen scroll-smooth">
        {/* Nav */}
        <nav className="sticky top-0 z-40 flex justify-center gap-6 border-b border-[var(--gold)]/30 bg-[var(--ivory)]/90 px-4 py-4 backdrop-blur sm:gap-10">
          {[["#story", "Our story"], ["#details", "The wedding"], ["#venue", "Venue"], ["#rsvp", "RSVP"]].map(([h, t]) => (
            <a key={h} href={h} className={link}>{t}</a>
          ))}
        </nav>
 
        {/* Hero */}
        <header className="grid min-h-[80vh] place-content-center px-6 text-center">
          <Reveal>
            <p className="wp-serif text-xl italic text-[var(--mute)]">We're getting married</p>
            <h1 className="wp-serif mt-3 text-6xl font-light leading-[0.95] sm:text-8xl">
              {COUPLE.groom}
              <span className="my-3 block text-3xl italic text-[var(--gold)] sm:text-4xl">&amp;</span>
              {COUPLE.bride}
            </h1>
            <span className="mx-auto mt-8 block h-px w-24 bg-[var(--gold)]" />
            <p className="mt-6 text-base tracking-[0.12em]">Saturday, 12 December 2026</p>
          </Reveal>
        </header>
 
        {/* Story */}
        <section id="story" className="mx-auto max-w-3xl scroll-mt-16 px-6 py-24">
          <Heading kicker="How it began">Our story</Heading>
          <ol className="relative grid gap-12 border-l border-[var(--gold)]/50 pl-8 sm:pl-12">
            {STORY.map((s) => (
              <li key={s.year} className="relative">
                <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-[var(--gold)] sm:-left-[53px]" />
                <Reveal>
                  <p className="wp-serif text-xl italic text-[var(--gold)]">{s.year}</p>
                  <h3 className="wp-serif mt-1 text-3xl font-light">{s.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-[var(--mute)]">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
 
        {/* Wedding details */}
        <section id="details" className="scroll-mt-16 bg-[#f1ebdf] px-6 py-24">
          <Heading kicker="Join us for">The wedding</Heading>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {EVENTS.map((e) => (
              <Reveal key={e.name}>
                <div className="h-full border border-[var(--gold)]/50 p-8 text-center">
                  <h3 className="wp-serif text-3xl font-light">{e.name}</h3>
                  <span className="mx-auto my-4 block h-px w-10 bg-[var(--gold)]" />
                  <p>{e.date}</p>
                  <p className="wp-serif mt-1 text-3xl">{e.time}</p>
                  <p className="mt-3 text-[var(--mute)]">{e.place}</p>
                  <p className="mt-3 text-sm italic text-[var(--mute)]">{e.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
 
        {/* Venue */}
        <section id="venue" className="mx-auto max-w-4xl scroll-mt-16 px-6 py-24">
          <Heading kicker="Find us at">The venue</Heading>
          <Reveal>
            <div className="grid gap-8 md:grid-cols-5">
              <div className="md:col-span-2">
                <h3 className="wp-serif text-3xl font-light">{VENUE.name}</h3>
                <p className="mt-3 text-[var(--mute)]">{VENUE.address}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--mute)]">{VENUE.notes}</p>
                <a href={mapLink} target="_blank" rel="noopener noreferrer"
                   className="mt-6 inline-block border border-[var(--gold)] px-7 py-3 text-sm tracking-wide transition-colors hover:bg-[var(--gold)] hover:text-[var(--ivory)]">
                  Get directions
                </a>
              </div>
              <div className="md:col-span-3">
                <iframe
                  title="Map of the venue"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full border border-[var(--gold)]/50 md:h-full md:min-h-[320px]"
                />
              </div>
            </div>
          </Reveal>
        </section>
 
        {/* RSVP */}
        <section id="rsvp" className="scroll-mt-16 bg-[#f1ebdf] px-6 py-24">
          <Heading kicker={`Kindly reply by ${RSVP_BY}`}>RSVP</Heading>
          <Reveal><Rsvp /></Reveal>
        </section>
 
        {/* Footer */}
        <footer className="px-6 py-16 text-center">
          <p className="wp-serif text-4xl font-light">{COUPLE.groom} &amp; {COUPLE.bride}</p>
          <p className="mt-3 text-sm text-[var(--mute)]">12 · 12 · 2026 · With love and gratitude</p>
        </footer>
      </div>
    </>
  );
}
 
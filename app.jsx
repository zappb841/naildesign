// Nail Design website — recreated from Figma source
// Home (hand graphic, click a nail to navigate) + 4 topic pages.

const { useState, useEffect, useMemo } = React;

/* ---------- defaults persisted by host ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showBackgrounds": true,
  "titleScale": 1,
  "accentPalette": "default"
}/*EDITMODE-END*/;

/* ---------- routing ---------- */
const ROUTES = [
  { id: "home",  label: "Home" },
  { id: "migak", label: "miGak" },
  { id: "self-expression", label: "Self Expression" },
  { id: "self-care",       label: "Self Care" },
  { id: "feminine",        label: "Feminine vs Masculine" },
  { id: "intricacy",       label: "Intricacy vs Plain" },
];

function useHashRoute() {
  const get = () => {
    const h = (window.location.hash || "#home").replace(/^#/, "");
    return ROUTES.find(r => r.id === h) ? h : "home";
  };
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const onHash = () => { setRoute(get()); window.scrollTo({ top: 0, behavior: "instant" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (id) => { window.location.hash = "#" + id; };
  return [route, go];
}

/* ---------- shared content ---------- */
const TOPICS = {
  "self-expression": {
    title: "Self\nExpression",
    titleColor: "#FFFFFF",
    bg: "url('bg-self-expression.jpg')",
    overlay: "linear-gradient(rgba(255,255,255,0.18),rgba(255,255,255,0.18)),linear-gradient(rgba(255,158,88,0.15),rgba(255,158,88,0.15))",
    pillColor: "rgb(249,254,212)",
    body: [
      "Nail Art, as mentioned in the interview, is a way of self expression that unfolds and develops between the designer and the client. Our interviewee explained that the priority is always the client's want, though many times there is a balanced exchange of ideas. With frequent clients, an artist can become familiar with their style and preferences in which they can later on start to take more independent decisions regarding the design. The relationship between a client and the artist is based on the trust that needs to exist between the two.",
      "The client must have faith in the designer's taste and capacity. This is a mutual understanding because by booking an artist this is already slightly implied. In the interview, the artist mentions that her role is to individually interpret the client's request in a way where her own style can still come through, yet still within the client's taste boundaries. This makes it so that nail art in general is not a one sided service, but one that requires talking and collaboration beforehand, and results in a combined expression art form.",
    ],
    quotes: [
      "Many see nail art as a form of self expression. How do you come up with what you design? Do you stick strongly to what the client wants exactly or would you say you have developed your own style over time?",
      "Would you say that nail design is a form of expressing yourself or the person you're designing for?",
    ],
  },
  "self-care": {
    title: "Self\nCare",
    titleColor: "#FFFFFF",
    bg: "url('bg-self-care.jpg')",
    overlay: "linear-gradient(rgba(255,226,173,0.10),rgba(255,226,173,0.10))",
    pillColor: "rgb(249,254,212)",
    body: [
      "Nail art is deeply correlated with the act of self care. For many, the time spent in the chair is less about the final look and more about being looked after — sitting still, slowing down, and letting someone else attend to a small, deliberate part of you. The ritual itself is the point.",
      "Beyond aesthetics, the interview highlights the importance of nail health within the industry. The artist explains that professional nail work involves understanding nail anatomy, being knowledgeable about products and tools, and focusing on the health of the client's nails rather than only the looks of it. They note that being a nail artist comes with a certain expertise that people might not realize.",
    ],
    quotes: [
      "What do you think about the fact that nails, what you create, is/are ephemeral? Where ephemeral art is art that does not last a long time. Does the fact that nails usually are temporary impact your design decisions?",
      "Another question about what nail art means outside of just design and art, and what it means for person to person as a form of self care.",
    ],
  },
  "feminine": {
    title: "Feminine vs\nMasculine",
    titleColor: "#FFFFFF",
    bg: "url('bg-feminine.jpg')",
    overlay: "linear-gradient(rgba(255,255,255,0.30),rgba(255,255,255,0.30)),linear-gradient(rgba(255,163,42,0.20),rgba(255,163,42,0.20))",
    pillColor: "rgb(255,217,226)",
    body: [
      "Nail art is a form of self-expression that society has historically associated with femininity. The nail artist explains that most nail art is often viewed as \u201Cfeminine,\u201D especially when it is very colorful and decorative. The artist also discusses how men who get their nails done are often seen as \u201Cbold\u201D because they challenge social expectations. However, they believe attitudes are changing, especially as more men are becoming interested in self care things such as skincare and nail care.",
      "At the same time, the interview critiques the idea that nail art belongs to one gender. The artist emphasizes that nails are simply an \u201Cextension of personality\u201D and that anyone should feel free to express themselves creatively without fear of societal judgment. Ultimately nail art is about confidence, identity, and should not be correlated with gender at all.",
    ],
    quotes: [
      "When men get their nails done, it is seen as art, or bold expression, but when women get it done, it is often seen as standard to beauty expectations, why do you think that is and how do you feel about that?",
      "Why do you think nail art has been correlated to femininity over time?",
    ],
  },
  "intricacy": {
    title: "Intricacy\nvs Plain",
    titleColor: "#FFFFFF",
    bg: "url('bg-intricacy.jpg')",
    overlay: "linear-gradient(rgba(251,128,165,0.20),rgba(251,128,165,0.20))",
    pillColor: "rgb(255,217,226)",
    body: [
      "When exploring the difference between intricate and plain nail design, the artist emphasizes that both are legitimate forms of expression. Choosing simple does not mean choosing less — it can be a deliberate aesthetic decision rooted in personal taste, lifestyle, or the desire for something quiet.",
      "At the same time, the interview challenges the assumption that plain designs are easier. The artist states that one color nails such as French manicures can take just as long as complex nail art. The manicure needs to look well done which is also time consuming. Lastly, it is all about individual expertise. Some nail artists are more focused on minimal designs, while others focus on more expressive ones.",
    ],
    quotes: [
      "Do you think getting a simple manicure, like one color, is still design?",
      "How do you think nail art compares to \u201Ctraditional design,\u201D such as product design or graphic design where they are meant to market or promote certain products. Do you think they are similar in any way, or too different to compare?",
    ],
  },
};

/* nail hotspots, as % of hand image (1024x1536)
   ordered: thumb (1) → pinky (5). */
const NAIL_HOTSPOTS = [
  // 1. thumb (red striped) — miGak artist page
  { cx: 16,  cy: 65, w: 14, h: 12, route: "migak",           label: "miGak — Shizuka Ishihara" },
  // 2. index (navy with flowers) — Self Expression
  { cx: 27,  cy: 18, w: 12, h: 14, route: "self-expression", label: "Self Expression" },
  // 3. middle (yellow + star) — Feminine vs Masculine
  { cx: 42,  cy: 9,  w: 12, h: 14, route: "feminine",        label: "Feminine vs Masculine" },
  // 4. ring (nude / pink) — Self Care
  { cx: 56,  cy: 14, w: 11, h: 14, route: "self-care",       label: "Self Care" },
  // 5. pinky (purple/pink) — Intricacy vs Plain
  { cx: 76,  cy: 27, w: 11, h: 14, route: "intricacy",       label: "Intricacy vs Plain" },
];

/* ---------- Home page ---------- */
function HomePage({ go, tweaks }) {
  const titleScale = tweaks.titleScale ?? 1;
  return (
    <main className="page page-home" data-screen-label="01 Home">
      {tweaks.showBackgrounds && (
        <div className="home-bg" style={{ backgroundImage: "url('bg-home.jpg')" }} />
      )}
      <div className="home-grain" />

      <div className="home-layout">
        {/* Left column: title + body */}
        <section className="home-text">
          <h1 className="display-title" style={{ fontSize: `clamp(72px, ${14 * titleScale}vw, ${240 * titleScale}px)` }}>
            Nail Design
          </h1>
          <p className="home-subtitle">Is it &ldquo;conventional&rdquo; design?</p>
          <p className="home-body">
            Nail Art is a form of self expression and identity that is centered around creativity and self care; through its evolution from historical past to contemporary present, we can examine new trends and identities that are tied up in this form of expression and how it echoes as design.
          </p>
        </section>

        {/* Right column: hand with clickable nails */}
        <section className="home-hand">
          <div className="hand-plate" aria-hidden="true">
            <Sparkle style={{ top: "-4%",  right: "-8%", width: 110 }} />
            <Sparkle style={{ top: "38%",  right: "26%", width: 78  }} />
            <Sparkle style={{ bottom: "8%",right: "30%", width: 56  }} />
          </div>
          <div className="hand-wrap">
            <img src="hand.png" alt="Hand with five nail-art designs, each a link to a different page" className="hand-img" />
            <Hotspots go={go} hotspots={NAIL_HOTSPOTS} />
          </div>
          <p className="hand-hint">Click on each nail to navigate</p>
        </section>
      </div>
    </main>
  );
}

function Sparkle({ style }) {
  return (
    <svg viewBox="0 0 100 100" className="sparkle" style={style} aria-hidden="true">
      <path d="M50 0 C53 35, 65 47, 100 50 C65 53, 53 65, 50 100 C47 65, 35 53, 0 50 C35 47, 47 35, 50 0 Z" fill="#F9FED4" />
    </svg>
  );
}

function Hotspots({ go, hotspots }) {
  return (
    <div className="hotspots">
      {hotspots.map((n, i) => (
        <button
          key={i}
          className="nail-hit"
          style={{
            left: `${n.cx - n.w/2}%`,
            top:  `${n.cy - n.h/2}%`,
            width:  `${n.w}%`,
            height: `${n.h}%`,
          }}
          onClick={() => go(n.route)}
          aria-label={`Go to ${n.label}`}
          title={n.label}
        />
      ))}
    </div>
  );
}

/* ---------- Topic page ---------- */
function TopicPage({ id, go, tweaks }) {
  const t = TOPICS[id];
  const titleScale = tweaks.titleScale ?? 1;
  if (!t) return null;
  return (
    <main className="page page-topic" data-screen-label={`Topic — ${t.title.replace(/\n/g," ")}`}>
      {tweaks.showBackgrounds && (
        <div className="topic-bg" style={{ backgroundImage: t.overlay + "," + t.bg }} />
      )}
      <div className="topic-grain" />

      {/* Home button */}
      <button className="home-btn" style={{ background: t.pillColor }} onClick={() => go("home")} aria-label="Back to home">
        <img src="home-icon.svg" alt="" />
      </button>

      {/* Tilted hand floating to the right, clickable */}
      <aside className="topic-hand">
        <div className="topic-hand-rotate">
          <img src="hand.png" alt="" className="hand-img" />
          <Hotspots go={go} hotspots={NAIL_HOTSPOTS} />
        </div>
        <p className="hand-hint topic-hint">Click on each nail to navigate</p>
      </aside>

      {/* Title (big serif, multi-line) */}
      <h1 className="topic-title display-title" style={{
        fontSize: `clamp(86px, ${15 * titleScale}vw, ${260 * titleScale}px)`,
        color: t.titleColor,
      }}>
        {t.title.split("\n").map((line, i) => <span key={i}>{line}</span>)}
      </h1>

      {/* Two body paragraphs — both left-aligned, stacked under the title */}
      <div className="topic-body">
        <p className="body-para body-wide">{t.body[0]}</p>
        <p className="body-para body-narrow">{t.body[1]}</p>
      </div>

      {/* Quotes section */}
      <section className="topic-quotes">
        <h2 className="quotes-h display-title" style={{ fontSize: `clamp(64px, ${10 * titleScale}vw, ${180 * titleScale}px)` }}>Questions:</h2>
        {t.quotes.map((q, i) => (
          <blockquote key={i} className="quote">{q}</blockquote>
        ))}
      </section>
    </main>
  );
}

/* ---------- miGak (Frame 2) — full multi-section page ---------- */
const MIGAK_DESIGNS = [
  "migak-1.png",
  "migak-2.png",
  "migak-3.png",
  "migak-4.png",
];
const YING_DESIGNS = [
  "ying-1.png",
  "ying-2.png",
  "ying-3.png",
  "ying-4.png",
];

function MigakPage({ go, tweaks }) {
  const titleScale = tweaks.titleScale ?? 1;
  return (
    <main className="page page-frame2" data-screen-label="Artists — miGak & Ying">
      {/* Home button — fixed so it follows scroll */}
      <button className="home-btn home-btn-fixed" style={{ background: "rgb(255,217,226)" }} onClick={() => go("home")} aria-label="Back to home">
        <img src="home-icon.svg" alt="" />
      </button>

      {/* ── Section 1: miGak hero ── */}
      <section className="artist-hero artist-hero--migak">
        {tweaks.showBackgrounds && (
          <div className="section-bg" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),url('migak-bg.jpg')" }} />
        )}
        <Stripes count={32} opacity={0.58} />

        <div className="artist-hero-inner">
          <h1 className="artist-name display-title" style={{
            fontSize: `clamp(120px, ${24 * titleScale}vw, ${360 * titleScale}px)`,
            color: "#ffffff",
          }}>miGak</h1>
          <p className="artist-credit">Shizuka Ishihara</p>

          <div className="artist-card-row">
            <PortraitCard plate="rgb(209,159,159)" img="migak-portrait.png" />
            <div className="artist-bio">
              <p className="artist-bio-text">
                Tokyo-based nail artist Shizuka Ishihara — known as miGak — builds tiny, sculptural worlds at the tip of each finger. Her work moves between quiet minimalism and exuberant ornament, but the through-line is craft: every stroke deliberate, every set personal.
              </p>
              <Socials
                tint="rgb(255,217,226)"
                ig="https://www.instagram.com/migaksalon/"
                web="https://www.migakny.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnVc2SOVgGZxag0B5d9WB33pK1igEk2AWCzOTeRJjfZE-aD3asHQB6TezGGnQ_aem_XR0CfCIfmp8x4iak_CRVBw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: miGak designs ── */}
      <section className="designs-section designs-section--migak">
        {tweaks.showBackgrounds && (
          <div className="section-bg" style={{ backgroundImage: "url('bg-designs-yellow.jpg')" }} />
        )}
        <div className="designs-inner">
          <h2 className="designs-title display-title" style={{
            fontSize: `clamp(90px, ${18 * titleScale}vw, ${270 * titleScale}px)`,
            color: "#ffffff",
            textAlign: "right",
          }}>Designs</h2>
          <DesignsGrid items={MIGAK_DESIGNS} plate="rgb(255,217,226)" />
          <p className="designs-credit" style={{ color: "rgb(182,37,75)" }}>miGak</p>
        </div>
      </section>

      {/* ── Section 3: Ying hero ── */}
      <section className="artist-hero artist-hero--ying">
        {tweaks.showBackgrounds && (
          <div className="section-bg" style={{ backgroundImage: "url('bg-ying.jpg')" }} />
        )}
        <Stripes count={32} opacity={0.32} />

        <div className="artist-hero-inner ying-layout">
          <div className="ying-card-row">
            <PortraitCard plate="rgb(216,110,133)" img="ying-portrait.png" />
            <div className="artist-bio ying-bio">
              <p className="artist-bio-text">
                Ying is a nail artist specializing in gel enhancements, from Gel-X Extensions to hand-drawn artwork, turning every set into a custom work of art.
              </p>
              <Socials
                tint="rgb(207,230,186)"
                ig="https://www.instagram.com/yingsnails/"
                web="https://yingsnails.glossgenius.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGngJe0qxxdZnurXKGWe4Nn00vdeyWQfoF4X9jRdQrJrm-O49DpIeEwkuHKX0c_aem_Wdsw0eFs6ozNuUZAOdmkCw"
              />
            </div>
          </div>

          {/* title sits above the row, anchored right, overlapping the photo's top-right corner */}
          <div className="ying-title-overlay">
            <h1 className="artist-name ying-name display-title" style={{
              fontSize: `clamp(120px, ${24 * titleScale}vw, ${360 * titleScale}px)`,
              color: "rgb(255,167,119)",
            }}>Ying</h1>
            <p className="artist-credit ying-credit">Independent Artist</p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Ying designs ── */}
      <section className="designs-section designs-section--ying">
        {tweaks.showBackgrounds && (
          <div className="section-bg" style={{ backgroundImage: "linear-gradient(rgba(206,228,134,0.2),rgba(206,228,134,0.2)),url('bg-designs-ying.jpg')" }} />
        )}
        <div className="designs-inner">
          <h2 className="designs-title display-title" style={{
            fontSize: `clamp(90px, ${18 * titleScale}vw, ${270 * titleScale}px)`,
            color: "#ffffff",
            textAlign: "left",
          }}>Designs</h2>
          <DesignsGrid items={YING_DESIGNS} plate="rgb(207,230,186)" />
          <p className="designs-credit" style={{ color: "rgb(154,78,24)" }}>Ying</p>
        </div>
      </section>

      {/* ── Section 5: Hand CTA ── */}
      <section className="hand-cta">
        {tweaks.showBackgrounds && (
          <div className="section-bg" style={{ backgroundImage: "url('bg-home.jpg')" }} />
        )}
        <div className="hand-cta-inner">
          <div className="hand-plate" />
          <Sparkle style={{ top: "8%", right: "12%", width: 90 }} />
          <Sparkle style={{ top: "44%", left: "10%", width: 60 }} />
          <Sparkle style={{ bottom: "16%", right: "20%", width: 70 }} />
          <div className="hand-wrap hand-wrap-cta">
            <img src="hand.png" alt="" className="hand-img" />
            <Hotspots go={go} hotspots={NAIL_HOTSPOTS} />
          </div>
          <p className="hand-hint hand-hint-cta">Click on each nail to navigate</p>
        </div>
      </section>
    </main>
  );
}

function Stripes({ count = 32, opacity = 0.5 }) {
  return (
    <div className="stripes" aria-hidden="true" style={{ opacity }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ left: `${(i + 0.5) * (100 / count)}%` }} />
      ))}
    </div>
  );
}

function PortraitCard({ plate, img }) {
  return (
    <div className="portrait-card" style={{ background: plate }}>
      <div className="portrait-img" style={{ backgroundImage: `url('${img}')` }} />
    </div>
  );
}

function Socials({ tint, ig, web }) {
  return (
    <div className="socials">
      <a className="social-pill" href={ig || "#"} target={ig ? "_blank" : undefined} rel={ig ? "noopener noreferrer" : undefined} onClick={ig ? undefined : (e => e.preventDefault())} aria-label="Instagram" style={{ background: tint }}>
        <img src="social-ig.png" alt="" />
      </a>
      <a className="social-pill" href={web || "#"} target={web ? "_blank" : undefined} rel={web ? "noopener noreferrer" : undefined} onClick={web ? undefined : (e => e.preventDefault())} aria-label="Website / Bookings" style={{ background: tint }}>
        <img src="social-web.png" alt="" />
      </a>
    </div>
  );
}

function DesignsGrid({ items, plate }) {
  return (
    <div className="designs-grid">
      {items.map((img, i) => (
        <article key={i} className="design-card">
          <div className="design-plate" style={{ background: plate }} />
          <div className="design-img" style={{ backgroundImage: `url('${img}')` }} />
        </article>
      ))}
    </div>
  );
}

function SocialGlyph({ kind }) {
  if (kind === "ig") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="rgb(112,84,66)" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="rgb(112,84,66)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="rgb(112,84,66)" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 H21" />
      <path d="M12 3 C 15.5 7, 15.5 17, 12 21 C 8.5 17, 8.5 7, 12 3 Z" />
    </svg>
  );
}

/* ---------- Tweaks panel ---------- */
function NailTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Appearance">
        <TweakToggle label="Photo backgrounds" value={tweaks.showBackgrounds} onChange={v => setTweak("showBackgrounds", v)} />
        <TweakSlider label="Title scale" min={0.6} max={1.4} step={0.05} value={tweaks.titleScale} onChange={v => setTweak("titleScale", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ---------- App ---------- */
function App() {
  const [route, go] = useHashRoute();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  let page;
  if (route === "home") page = <HomePage go={go} tweaks={tweaks} />;
  else if (route === "migak") page = <MigakPage go={go} tweaks={tweaks} />;
  else page = <TopicPage id={route} go={go} tweaks={tweaks} />;
  return (
    <>
      {page}
      <NailTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

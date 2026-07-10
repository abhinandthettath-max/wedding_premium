import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Instagram,
  MapPin,
  Navigation,
  X,
} from "lucide-react";

const invitation = {
  groom: "Dr. Jewel Abraham",
  bride: "Dr. Merin V Rose",
  shortGroom: "Dr. Jewel",
  shortBride: "Dr.Merin",
  eventName: "Engagement",
  dateParts: ["24", "08", "2026"],
  weekday: "Monday",
  countdownTarget: "2026-08-24T12:00:00+05:30",
  heroImage: "/assets/hero.jpeg",
  coupleImage: "/assets/couple.jpeg",
  introImage: "/assets/gallery-1.jpeg",
  message: "Join us as we tie the knot and seek the blessings of almighty",
  parents: {
    groom: "Mr. Abraham K Thomas & Mrs. Elsa Abraham ,Kurichimala House",
    bride: "Mr. Vino Joseph & Mrs. Biji Rose Mathew Oonnukallamattathil House",
  },
};

const companyInstagram = {
  handle: "digitalaffairco",
  url: "https://www.instagram.com/digitalaffairco?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  logo: "/assets/digital-affairco.svg",
};

const events = [
  {
    title: "Engagement Ceremony",
    image: "/assets/ceremony.jpeg",
    date: "Monday, August 24, 2026",
    time: "04:00 PM",
    venue: "St Joseph's church , Devagiri Calicut, Kerala",
    modalVenue: "St Joseph's church , Devagiri Calicut",
    region: "Kerala, India",
    map: "https://maps.app.goo.gl/MRKU11URgHhP5QiU6?g_st=iw",
  },
  {
    title: "Wedding Ceremony",
    image: "/assets/hero.jpeg",
    date: "Sunday, August 30, 2026",
    time: "10:30 AM",
    venue: "St. Simon's Jacobite Syrian Orthodox Church, Velloor",
    modalVenue: "St. Simon's Jacobite Syrian Orthodox Church, Velloor",
    region: "Velloor, Kerala",
    map: "https://maps.app.goo.gl/QofZw1hVm1RzJtxk8?g_st=ic",
  },
  {
    title: "Wedding Reception",
    image: "/assets/reception.jpeg",
    date: "Sunday, August 30, 2026",
    time: "01:00 PM",
    venue: "St. John's Orthodox Cathedral Pampady",
    note: "Following the wedding ceremony",
    modalVenue: "St. John's Orthodox Cathedral Pampady",
    region: "Pampady, Kerala",
    map: "https://maps.app.goo.gl/NsQsYprEr272cKEA6",
  },
];

const gallery = [
  "/assets/gallery-1.jpeg",
  "/assets/gallery-2.jpeg",
  "/assets/gallery-3.jpeg",
  "/assets/gallery-4.jpeg",
  "/assets/gallery-5.jpeg",
  "/assets/gallery-6.jpeg",
];

function useCountdown(target) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return remaining;
}

function getRemaining(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    mins: Math.floor((diff % hour) / minute),
    secs: Math.floor((diff % minute) / 1000),
  };
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  const counts = useCountdown(invitation.countdownTarget);

  const timeline = useMemo(
    () => [
      { label: "Days", value: counts.days },
      { label: "Hours", value: counts.hours },
      { label: "Mins", value: counts.mins },
      { label: "Secs", value: counts.secs },
    ],
    [counts],
  );

  useEffect(() => {
    document.body.classList.toggle("intro-locked", !isOpen);
  }, [isOpen]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isOpen]);

  async function openInvitation() {
    setIsOpen(true);
    toggleMusic(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleMusic(forceOn) {
    const next = typeof forceOn === "boolean" ? forceOn : !musicOn;
    setMusicOn(next);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (next) {
        audio.volume = 0.42;
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setMusicOn(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/invitation-melody.wav" loop preload="auto" />

      <IntroCover isOpen={isOpen} onOpen={openInvitation} />

      <main aria-hidden={!isOpen} className={isOpen ? "site active" : "site"}>
        <Hero />
        <Countdown timeline={timeline} />
        <Couple />
        <WhenWhere />
        <Gallery />
        <ThankYou />
      </main>

      {isOpen && (
        <FloatingControls
          musicOn={musicOn}
          onMusic={() => toggleMusic()}
          onLocations={() => setLocationsOpen(true)}
        />
      )}

      <LocationSheet
        open={locationsOpen}
        onClose={() => setLocationsOpen(false)}
      />
    </>
  );
}

function IntroCover({ isOpen, onOpen }) {
  return (
    <section
      className={isOpen ? "intro-cover slide-up" : "intro-cover"}
      style={{ "--intro-image": `url(${invitation.introImage})` }}
      aria-hidden={isOpen}
    >
      <div className="intro-content">
        <p className="eyebrow">The Engagement Invitation Of</p>
        <h1>
          <span>{invitation.shortGroom}</span>
          <small>&</small>
          <span>{invitation.shortBride}</span>
        </h1>
        <button className="gold-button" type="button" onClick={onOpen}>
          Open Invitation
        </button>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section
      className="hero"
      style={{ "--hero-image": `url(${invitation.heroImage})` }}
    >
      <div className="hero-overlay" />
      <div className="hero-content" data-reveal>
        <p className="eyebrow light">We Are Getting Engaged</p>
        <h2>Save the Date</h2>
        <p className="signature">
          {invitation.shortGroom} & {invitation.shortBride}
        </p>
        <p className="event-type">{invitation.eventName}</p>
        <div className="date-row" aria-label="June 6, 2026">
          {invitation.dateParts.map((part, index) => (
            <span key={`${part}-${index}`}>
              {part}
              {index < invitation.dateParts.length - 1 && <i />}
            </span>
          ))}
        </div>
        <p className="weekday">{invitation.weekday}</p>
        <p className="hero-note">{invitation.message}</p>
        <a className="scroll-cue" href="#big-day" aria-label="Scroll to details">
          <span>Scroll</span>
          <b />
          <b />
          <b />
        </a>
      </div>
    </section>
  );
}

function Countdown({ timeline }) {
  return (
    <section id="big-day" className="countdown-section pattern-band">
      <SectionTitle>The Big Day</SectionTitle>
      <div className="countdown-grid" data-reveal>
        {timeline.map((item) => (
          <div className="countdown-ring" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Couple() {
  return (
    <section className="couple-section">
      <SectionTitle>The Couple</SectionTitle>
      <div className="couple-photo-frame" data-reveal>
        <img src={invitation.coupleImage} alt="Jewel & Merin" />
      </div>
      <div className="couple-details" data-reveal>
        <Person
          label="The Groom"
          name={invitation.groom}
          relation="S/O"
          parents={invitation.parents.groom}
        />
        <div className="ampersand" aria-hidden="true">
          &
        </div>
        <Person
          label="The Bride"
          name={invitation.bride}
          relation="D/O"
          parents={invitation.parents.bride}
        />
      </div>
    </section>
  );
}

function Person({ label, name, relation, parents }) {
  return (
    <article className="person">
      <p className="script-label">{label}</p>
      <h3>{name}</h3>
      <p className="relation">{relation}</p>
      <p className="parents">{parents}</p>
    </article>
  );
}

function WhenWhere() {
  return (
    <section className="events-section pattern-band-soft">
      <SectionTitle>When & Where</SectionTitle>
      <div className="event-list" data-reveal>
        {events.map((event) => (
          <EventCard event={event} key={event.title} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }) {
  return (
    <article className="event-card">
      <img src={event.image} alt={event.title} />
      <div className="event-body">
        <h3>{event.title}</h3>
        <EventDetail icon={<Calendar />} text={event.date} />
        <EventDetail icon={<Clock />} text={event.time} />
        <EventDetail icon={<MapPin />} text={event.venue} />
        {event.note && <p className="event-note">{event.note}</p>}
        <a className="map-link" href={event.map} target="_blank" rel="noreferrer">
          <Navigation size={16} />
          Open in Maps
        </a>
      </div>
    </article>
  );
}

function EventDetail({ icon, text }) {
  return (
    <p className="event-detail">
      <span>{icon}</span>
      <em>{text}</em>
    </p>
  );
}

function Gallery() {
  return (
    <section className="gallery-section" aria-label="Captured Moments">
      <div className="gallery-stack">
        <div className="gallery-title">
          <SectionTitle>Captured Moments</SectionTitle>
        </div>
        {gallery.map((src, index) => (
          <figure
            className="polaroid"
            style={{
              "--i": index,
              "--rotation": `${[-6, 4, -3, 5, -4, 3][index]}deg`,
            }}
            key={src}
          >
            <img src={src} alt={`Wedding Moment ${index}`} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function ThankYou() {
  return (
    <section className="thank-you-section">
      <div className="thank-you-card" data-reveal>
        <SectionTitle>Thank You</SectionTitle>
        <p>
          Our celebration wouldn't be complete without you. We can't wait to see
          you and share these special memories!
        </p>
        <Heart className="heart" fill="currentColor" />
        <h3>Jewel & Merin</h3>
      </div>
      <div className="bottom-branding" data-reveal>
        <a
          className="instagram-handle"
          href={companyInstagram.url}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Digital Affair Co on Instagram"
        >
          <Instagram aria-hidden="true" />
          <span>@{companyInstagram.handle}</span>
        </a>
        <img
          className="bottom-logo"
          src={companyInstagram.logo}
          alt="Digital Affair Co"
        />
      </div>
    </section>
  );
}

function FloatingControls({ musicOn, onMusic, onLocations }) {
  return (
    <div className="floating-controls" aria-label="Invitation controls">
      <button
        className={musicOn ? "round-control active" : "round-control"}
        type="button"
        onClick={onMusic}
        aria-label={musicOn ? "Pause music" : "Play music"}
      >
        <span className="equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
      <button
        className="round-control"
        type="button"
        onClick={onLocations}
        aria-label="Open event locations"
      >
        <MapPin />
      </button>
    </div>
  );
}

function LocationSheet({ open, onClose }) {
  return (
    <div className={open ? "sheet-wrap open" : "sheet-wrap"} aria-hidden={!open}>
      <button className="sheet-backdrop" type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
        <span className="sr-only">Close locations</span>
      </button>
      <section className="location-sheet" role="dialog" aria-modal="true" aria-label="Event Locations">
        <header>
          <h3>Event Locations</h3>
          <button type="button" onClick={onClose} aria-label="Close location sheet">
            <X />
          </button>
        </header>
        <div className="sheet-locations">
          {events.map((event) => (
            <article className="sheet-location" key={event.title}>
              <div>
                <h4>{event.title === "Engagement Ceremony" ? "The Engagement Ceremony" : event.title === "Wedding Ceremony" ? "The Wedding Ceremony" : event.title}</h4>
                <p>
                  <strong>{event.modalVenue}</strong>
                  <span>{event.region}</span>
                </p>
              </div>
              <a href={event.map} target="_blank" rel="noreferrer">
                <MapPin />
                Get Directions
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      <span />
    </div>
  );
}

export default App;

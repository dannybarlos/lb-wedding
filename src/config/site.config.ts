/**
 * Static site content — couple info, dates, copy, and structure.
 * Feature flags and backend driver live in src/config/flags.ts.
 * All values are as const — change here to update all components at once.
 */
export const SITE_CONFIG = {

  // ─── Couple ───────────────────────────────────────────────
  couple: {
    name1: "Laurice",
    name2: "Bernie",
    monogram: "L & B",
    hashtag: "#LauriceAndBernie2027",
  },

  // ─── Wedding Details ──────────────────────────────────────
  wedding: {
    date: "2027-07-23T16:00:00",
    displayDate: "July 23, 2027",
    venue: {
      name: "Cecil Green Park House",
      address: "6291 Cecil Green Park Rd, Vancouver, BC V6T 1Z1, Canada",
      mapsUrl: "https://maps.google.com/?q=Cecil+Green+Park+House",
      illustrationSrc: "/images/venue-illustration.png",
      fadeIntensity: "medium" as "soft" | "medium" | "hard",
    },
  },

  // ─── Navigation ───────────────────────────────────────────
  nav: {
    links: [
      { label: "Travel",   href: "/travel" },
      { label: "Registry", href: "/registry" },
      { label: "FAQ",      href: "/faq" },
    ],
    rsvpLabel: "RSVP",
    rsvpHref: "/rsvp",
  },

  // ─── Hero ───────────────────────────────────────────────────
  hero: {
    tagline: "you're cordially invited to the adventure that is...",
    photos: [
      { src: "/images/hero-1.jpg", alt: "landscape 1", rotate: -3 },
      { src: "/images/hero-2.jpg", alt: "landscape 2", rotate: 2 },
    ],
  },

  // ─── Love Story ───────────────────────────────────────────
  loveStory: {
    heading: "our love story",
    stages: [
      {
        id: "stage-1",
        label: "stage 1: the beginning",
        body: "It all started when...",
        photos: [
          { src: "/images/love-story/s1-1.jpg", caption: "day one" },
          { src: "/images/love-story/s1-2.jpg", caption: "somewhere sunny" },
        ],
      },
      {
        id: "stage-2",
        label: "stage 2: toronto and adventures",
        body: "We reconnected in Toronto after covid and had our first date at the pilot... then the next 3 years were a blur of adventures.",
        photos: [
          { src: "/images/love-story/s2-1.jpg", caption: "vancouver island storm watching and hiking haha" },
          { src: "/images/love-story/s2-2.jpg", caption: "somewhere cold" },
        ],
      },
      {
        id: "stage-3",
        label: "stage 3: to engagement, and beyond!",
        body: "We quickly knew that this would be it, and eventually the ring sealed the deal... and maybe some gyro too.",
        photos: [
          { src: "/images/love-story/s3-1.jpg", caption: "the rest of greece was alllll love" },
        ],
      },
    ],
  },

  // ─── Travel Page ────────────────────────────────────────────
  travel: {
    heading: "getting there",
    sections: [
      {
        id: "flights",
        title: "Flights",
        body: "Vancouver International Airport (YVR) is the closest airport.",
        link: { label: "Search Flights", href: "https://google.com/flights" },
      },
      {
        id: "hotels",
        title: "Hotel Block",
        body: "We've reserved a room block at the Westin Bayshore.",
        link: { label: "Book Your Room", href: "#" },
      },
      {
        id: "transit",
        title: "Getting Around",
        body: "Vancouver has excellent public transit. The SkyTrain connects YVR to downtown in 25 minutes.",
      },
    ],
  },

  // ─── Registry Page ────────────────────────────────────────────
  registry: {
    heading: "registry",
    subheading: "Your presence is the greatest gift. But if you'd like...",
    links: [
      { label: "Zola",           href: "https://zola.com",   icon: "gift" },
      { label: "Amazon",         href: "https://amazon.com", icon: "package" },
      { label: "Honeymoon Fund", href: "#",                  icon: "plane" },
    ],
  },

  // ─── FAQ Page ─────────────────────────────────────────────────
  faq: {
    heading: "questions?",
    items: [
      { q: "What is the dress code?",                a: "Garden formal. Think florals, linen, pastels." },
      { q: "Are children welcome?",                  a: "We love your kids! Children under 5 are welcome." },
      { q: "Is there parking at the venue?",         a: "Limited parking on-site. We recommend rideshare." },
      { q: "What time should I arrive?",             a: "Doors open at 3:30pm. Ceremony begins at 4:00pm sharp." },
      { q: "Will there be a shuttle?",               a: "Yes — details to be sent closer to the date." },
      { q: "Can I take photos during the ceremony?", a: "We ask guests to be fully unplugged during the ceremony." },
    ],
  },

  // ─── RSVP ─────────────────────────────────────────────────────
  rsvp: {
    heading: "will you join us?",
    deadline: "June 1, 2027",
    mealOptions: ["Chicken", "Fish", "Vegetarian"],
    submitLabel: "Send RSVP",
    successMessage: "We can't wait to celebrate with you! 🎉",
    errorMessage: "Something went wrong. Please try again or email us directly.",
  },

  // ─── Confetti ─────────────────────────────────────────────────
  confetti: {
    particleCount: 60,
    spread: 120,
    origin: { x: 0.5, y: 0.4 },
    colors: ["#c9a96e", "#e8d5b0", "#a67c52", "#f0e6d0", "#8b6340"],
    scalar: 0.9,
    ticks: 180,
    gravity: 0.6,
    drift: 0.1,
    shapes: ["circle", "square"] as ("circle" | "square")[],
    fireOnce: true,
  },

  // ─── Animation System ───────────────────────────────────────────
  animations: {
    enabled: true,
    reducedMotion: "auto" as "auto" | "always" | "never",
    durations: {
      fast:   0.15,
      normal: 0.4,
      slow:   0.7,
    },
    easings: {
      enter: [0.22, 1, 0.36, 1] as [number, number, number, number],
      exit:  [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },

} as const;

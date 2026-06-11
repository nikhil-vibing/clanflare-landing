/**
 * ALL page copy — single source of truth (v11 spec §2).
 * Positioning (2026-06): LEAD WITH OWNERSHIP, NOT MONEY. Spine = digital
 * sovereignty — own your audience, your app, your data. The un-copyable
 * wedge is OWNERSHIP + DONE-FOR-YOU ("we build it and run it with you");
 * no competitor (Circle, Skool, TagMango, Ghost) can truthfully claim both.
 * Money is a quiet consequence of ownership, never the headline.
 * Tagline: "Gather your clan. Own your world." (brand-native, ownable).
 */
export const copy = {
  meta: {
    title: "Clanflare — Gather your clan. Own your world.",
    description:
      "Your own branded community app on web, iOS and Android — your audience, your data, your revenue, owned by you. Clanflare builds it, runs it with you, and hands you the keys.",
  },

  nav: {
    links: [
      { label: "Platform", href: "#product" },
      { label: "Services", href: "#pillars" },
      { label: "How it works", href: "#how" },
      { label: "Contact", href: "#contact" },
    ],
    cta: "Get in touch",
  },

  hero: {
    eyebrow: "Own your community · Built and run with you",
    // H1: two parallel verb-commands; "Own your world." lands in teal with
    // the hand-drawn squiggle. The rent/own antithesis lives in TenantTrap.
    h1: { lead: "Gather your clan.", own: "Own your world." },
    sub: "Your people, your content, your data — on your own branded app, not rented from an algorithm that can bury you overnight. Clanflare builds it, runs it with you, and hands you the keys.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "Take the 30-second tour",
    url: "yourbrand.com/community",
    badge: ["iOS", "Android", "Web"],
    founderQuote: {
      q: "We launched on web, iOS and Android in two weeks. My old setup took eight months and three tools.",
      name: "Rhea Kapoor",
      role: "Creator · 90k community",
    },
  },

  // Above-the-fold credibility strip (YC: ~20-43% hero-CTA lift). Real claims
  // only — these mirror numbers stated elsewhere on the page, never invented.
  credibility: {
    label: "Bring your audience from",
    proof: [
      { v: "2 weeks", l: "brief to launch" },
      { v: "web · iOS · Android", l: "one build" },
      { v: "100%", l: "revenue owned" },
    ],
  },

  trap: {
    beats: [
      {
        line: "You don't own your audience. You rent it.",
        sub: "Every follower lives on land you don't control.",
      },
      {
        line: "One algorithm change buries your reach. One policy update locks your members out.",
        sub: "You built the audience — but you're a tenant on someone else's land.",
      },
      {
        line: "Clanflare changes who holds the keys.",
        sub: "Your app. Your members. Your data. Your revenue.",
      },
    ],
    platforms: ["YouTube", "Instagram", "Discord", "Patreon", "TikTok", "X"],
  },

  pillars: {
    eyebrow: "What we do",
    heading: { pre: "Build it. Run it.", own: "Own it." },
    items: [
      {
        n: "①",
        title: "Build",
        body: "Your own branded app — feeds, live rooms, courses, and chat — on web, iOS, and Android. Under your name, not ours.",
      },
      {
        n: "②",
        title: "Run",
        body: "You don't do it alone. We program it, moderate it, and grow it with you — so it's alive from day one.",
      },
      {
        n: "③",
        title: "Own",
        body: "The whole point. Your members, your data, your reach — and the revenue, paid into your account, not held by a platform. Secured, portable, and yours to keep. No algorithm in the middle, no cut taken, no lock-in.",
        rev: "the revenue, paid into your account,",
      },
    ],
  },

  product: {
    eyebrow: "One app",
    heading: "Everything your clan does, in one app you own.",
    lead: "One product replaces the nine tools you're duct-taping together — on your brand, on web and mobile.",
    tiles: [
      {
        key: "feeds",
        title: "Feeds",
        body: "Long-form posts, replays, and chat in one stream your members actually open.",
      },
      {
        key: "live",
        title: "Live voice rooms",
        body: "Drop-in voice and stage events — the moments that turn members into regulars.",
      },
      {
        key: "courses",
        title: "Courses",
        body: "Your curriculum, your pace — progress tracked lesson by lesson.",
      },
      {
        key: "membership",
        title: "Membership & billing",
        body: "Tiers, subscriptions, and one-off sales — cards and UPI in, paid straight out to your account. No platform cut, no payout you wait weeks for.",
      },
      {
        key: "streak",
        title: "Streaks",
        body: "Daily streaks turn one-time visitors into thirty-day regulars.",
      },
      {
        key: "leaderboard",
        title: "Leaderboards",
        body: "Status and friendly competition that surface your most committed members.",
      },
      {
        key: "mobile",
        title: "Native mobile + short-form",
        body: "Real iOS and Android apps with a vertical video feed and push that actually reaches people — not a wrapped website.",
      },
    ],
    tail: "Everything your clan does, in a place that belongs to you. ↓",
  },

  // Category wedge: white-label-first. The same app wears two real brands
  // (teal "Aurora" ⟷ red "Attack Mode") — proof, not a claim. Interactive
  // brand-swap section after the bento (research: a wedge earns its own moment).
  brand: {
    eyebrow: "Make it yours",
    heading: "Your brand on every pixel. Ours on none.",
    body: "Same platform underneath. Your name on the icon, your colours in every pixel, your voice in every screen. Members never see Clanflare — they see you.",
    hint: "Pick a brand — watch the whole app repaint.",
    skins: [
      { id: "aurora", name: "Aurora", tag: "Calm · editorial", shot: "appDesktop", url: "aurora.community", accent: "#5FC9CA" },
      { id: "attack", name: "Attack Mode", tag: "Bold · high-energy", shot: "whitelabeled", url: "attackmode.app", accent: "#E5484D" },
    ],
    caption: "Two brands, one product — and infinitely more. Your logo, your colours, live in days — branded iOS and Android apps included, not a five-figure add-on.",
  },

  vision: {
    pre: "The internet promised creators independence. Then it rented it back to them — one feed, one algorithm, one fee at a time.",
    big: "Own your audience, your work, and the place your people call home. Not borrowed. Not rented.",
    final: "Yours.",
  },

  // Real numbers only (confirmed in the design chat) — if it isn't real, omit it.
  stats: {
    items: [
      { value: 2, suffix: "wks", label: "Live, start to launch", sub: "Branded app on web + iOS + Android" },
      { value: 50, prefix: "+", suffix: "%", label: "More retention", sub: "Members stay in a home that's theirs" },
      { value: 30, prefix: "+", suffix: "%", label: "Higher engagement", sub: "Audience shows up when you own the channel" },
      { value: 9, label: "Tools replaced", sub: "One app instead of the duct-taped stack" },
    ],
    foot: "Measured across communities Clanflare builds and runs.",
  },

  proof: {
    eyebrow: "Will it work for me?",
    heading: "It already works — across every kind of community.",
    sub: "Coaches, brands, educators. Same platform, their name on the door.",
    niches: [
      {
        role: "Coach",
        result: { pre: "Sold out a cohort in ", value: 48, decimals: 0, unit: " hours", post: " — no ad spend." },
        who: "Aanya Mehra",
        whoSub: "Mindset & performance coaching",
      },
      {
        role: "Brand",
        result: { pre: "Moved ", value: 40000, decimals: 0, unit: " followers", post: " off rented feeds into their own app." },
        who: "Kabir Rao",
        whoSub: "Head of community, fitness brand",
      },
      {
        role: "Educator",
        result: { pre: "Course completion up ", value: 2.3, decimals: 1, unit: "×", post: " once learning lived in one place." },
        who: "Dr. Leena Iyer",
        whoSub: "Online educator, 11k students",
      },
    ],
    testimonial: {
      q: "The Clanflare team didn't just hand me software — they ran the launch week with me. That's the part nobody else does.",
      name: "Sana Qureshi",
      role: "Wellness educator",
    },
  },

  how: {
    eyebrow: "How it works",
    heading: "From brief to a living community.",
    steps: [
      {
        title: "Tell us your community",
        body: "Who your people are and where they gather now. A few sentences is plenty.",
      },
      {
        title: "We build & launch your app",
        body: "Branded, on web and mobile, live in 2 weeks — not years. You approve it; no dev team needed on your side.",
      },
      {
        title: "We run it — and you own it",
        body: "We grow it with you. The audience, the data, and the keys are yours.",
      },
    ],
  },

  contact: {
    eyebrow: "Get in touch",
    heading: "Your clan. Your world. Your app.",
    sub: "Tell us who you're building for. A 15-minute call, no commitment — and if you ever leave, the app, the data and the audience leave with you. No lock-in.",
    email: "hello@clanflare.com",
    fields: {
      name: { label: "Name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@company.com" },
      about: { label: "What are you building?", placeholder: "A few words about your community" },
    },
    submit: "Get in touch",
    note: "Real humans read every message. We reply within a day — no bots, no sales pressure.",
    success: "We got it. You'll hear from a human within a day.",
  },

  footer: {
    line: "Gather your clan. Own your world — and everything in it. We build it and run it with you.",
    copyright: "© 2026 Clanflare",
  },
} as const;

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

// Register once for the whole client bundle (v11 spec §2).
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

// Touch devices show/hide the address bar on scroll, which resizes the
// viewport and fires ScrollTrigger.refresh() — making any pinned scene jump.
// We no longer pin below 1024px, but this is the cheap belt-and-suspenders:
// ignore vertical resizes (≥25% vh) on touch-only devices. (GSAP docs.)
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

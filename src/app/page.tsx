import dynamic from "next/dynamic";
import BrandShowcase from "@/components/sections/BrandShowcase";
import CtaForm from "@/components/sections/CtaForm";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Nav from "@/components/sections/Nav";
import Pillars from "@/components/sections/Pillars";
import ProductBento from "@/components/sections/ProductBento";
import Proof from "@/components/sections/Proof";
import StatsBand from "@/components/sections/StatsBand";

// GSAP-heavy showpieces load in their own chunks (perf budget, v11 §4)
const TenantTrap = dynamic(() => import("@/components/sections/TenantTrap"));
const Vision = dynamic(() => import("@/components/sections/Vision"));

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TenantTrap />
        <Pillars />
        <StatsBand />
        <ProductBento />
        <BrandShowcase />
        <Vision />
        <Proof />
        <HowItWorks />
        <CtaForm />
      </main>
      <Footer />
    </>
  );
}

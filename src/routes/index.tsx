import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { MenuSection } from "@/components/site/MenuSection";
import { Highlights } from "@/components/site/Highlights";
import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.seo.title },
      { name: "description", content: siteConfig.seo.description },
      { property: "og:title", content: siteConfig.seo.title },
      { property: "og:description", content: siteConfig.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <MenuSection />
        <Highlights />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

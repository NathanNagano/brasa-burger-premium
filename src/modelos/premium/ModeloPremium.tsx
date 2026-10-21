import { Header } from "./Header";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { MenuSection } from "./MenuSection";
import { Highlights } from "./Highlights";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export function ModeloPremium() {
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

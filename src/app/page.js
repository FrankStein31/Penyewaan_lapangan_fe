import Hero from "@/sections/Hero";
import Facilities from "@/sections/Facilities";
import Services from "@/sections/Services";
import About from "@/sections/About";
import LapanganTerlaris from "@/sections/LapanganTerlaris";
import Gallery from "@/sections/Gallery";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Facilities />
      <Services />
      <LapanganTerlaris />
      <Gallery />
      <Footer />
    </>

  );
}

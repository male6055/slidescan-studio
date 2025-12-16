import Hero from "@/components/Hero";
import Technology from "@/components/Technology";
import Features from "@/components/Features";
import Applications from "@/components/Applications";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Technology />
      <Features />
      {/*<Applications />*/}
      <CTA />
    </main>
  );
};

export default Index;

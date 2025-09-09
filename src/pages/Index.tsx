import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Courses from "@/components/Courses";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      <Hero />
      <Services />
      <Courses />
      <About />
      <Footer />
    </div>
  );
};

export default Index;

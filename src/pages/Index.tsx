// Açaíteria - Site Principal
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import Combos from '@/components/Combos';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Menu />
        <Combos />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

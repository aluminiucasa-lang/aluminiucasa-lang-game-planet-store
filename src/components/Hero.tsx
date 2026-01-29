import heroImage from "@/assets/hero-console.jpg";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gamepad2, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-2xl animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-widest text-sm">
              Nova Geração
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">CONSOLES</span>
            <br />
            <span className="text-foreground">DE ÚLTIMA GERAÇÃO</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg">
            Descubra a experiência de jogo definitiva. Gráficos em 4K, carregamento instantâneo e mundos imersivos te esperam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Comprar Agora
            </Button>
            <Button variant="outline" size="xl" onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}>
              <Zap className="w-5 h-5 mr-2" />
              Ver Ofertas
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-display font-bold text-primary">4K</div>
              <div className="text-muted-foreground text-sm">Ultra HD</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">120</div>
              <div className="text-muted-foreground text-sm">FPS</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary">1TB</div>
              <div className="text-muted-foreground text-sm">SSD</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

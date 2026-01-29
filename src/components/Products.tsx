import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import horiMain from "@/assets/hori-main.png";
import hori2 from "@/assets/hori-2.png";
import hori3 from "@/assets/hori-3.png";
import hori4 from "@/assets/hori-4.png";
import hori5 from "@/assets/hori-5.png";
import r36sMain from "@/assets/r36s-main.png";
import r36s2 from "@/assets/r36s-2.png";
import r36s3 from "@/assets/r36s-3.png";
import r36s4 from "@/assets/r36s-4.png";
import r36s5 from "@/assets/r36s-5.png";
import switchMain from "@/assets/switch-main.png";
import switch2 from "@/assets/switch-2.png";
import switch3 from "@/assets/switch-3.png";
import switch4 from "@/assets/switch-4.png";
import switch5 from "@/assets/switch-5.png";
import gamestickMain from "@/assets/gamestick-main.png";
import gamestick2 from "@/assets/gamestick-2.png";
import gamestick3 from "@/assets/gamestick-3.png";
import gamestick4 from "@/assets/gamestick-4.png";
import gamestick5 from "@/assets/gamestick-5.png";
import gamestickliteMain from "@/assets/gamesticklite-main.png";
import gamesticklite2 from "@/assets/gamesticklite-2.png";
import gamesticklite3 from "@/assets/gamesticklite-3.png";
import gamesticklite4 from "@/assets/gamesticklite-4.png";
import gamesticklite5 from "@/assets/gamesticklite-5.png";
import xboxMain from "@/assets/xbox-main.png";
import xbox2 from "@/assets/xbox-2.png";
import xbox3 from "@/assets/xbox-3.png";
import xbox4 from "@/assets/xbox-4.png";
import xbox5 from "@/assets/xbox-5.png";
import m88Main from "@/assets/m88-main.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface ConsoleProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  rating: number;
  features: string[];
  badge?: string;
}

const products: ConsoleProduct[] = [
  {
    id: 1,
    name: "HORI Nintendo Switch Split Pad Compact (Mint Green x White)",
    brand: "HORI",
    price: 369.99,
    originalPrice: 449.99,
    image: horiMain,
    images: [horiMain, hori2, hori3, hori4, hori5],
    rating: 4.9,
    features: ["Ergonômico", "Modo Portátil", "Licenciado Nintendo"],
    badge: "Mais Vendido",
  },
  {
    id: 2,
    name: "Console R36S Retro Portátil 128GB",
    brand: "R36S",
    price: 274.99,
    originalPrice: 349.99,
    image: r36sMain,
    images: [r36sMain, r36s2, r36s3, r36s4, r36s5],
    rating: 4.8,
    features: ["39.000+ Jogos", "Tela IPS 3.5\"", "Arkos 2.0"],
    badge: "Melhor Custo",
  },
  {
    id: 3,
    name: "Console Nintendo Switch OLED - Branco",
    brand: "Nintendo",
    price: 2446.99,
    originalPrice: 2799,
    image: switchMain,
    images: [switchMain, switch2, switch3, switch4, switch5],
    rating: 4.7,
    features: ["OLED 7\"", "Portátil", "Exclusivos"],
  },
  {
    id: 4,
    name: "Retro Game Stick 4K HDMI 2.4GHz Wireless TV Retro Gaming Console",
    brand: "Game Stick",
    price: 143.90,
    originalPrice: 182.00,
    image: gamestickMain,
    images: [gamestickMain, gamestick2, gamestick3, gamestick4, gamestick5],
    rating: 4.6,
    features: ["4K HDMI", "20.000+ Jogos", "Wireless 2.4GHz"],
    badge: "Plug & Play",
  },
  {
    id: 5,
    name: "Game Stick 4K Lite Retro 2 Controles Sem Fio 20.000+ Jogos",
    brand: "Game Stick Lite",
    price: 97.99,
    originalPrice: 124.00,
    image: gamestickliteMain,
    images: [gamestickliteMain, gamesticklite2, gamesticklite3, gamesticklite4, gamesticklite5],
    rating: 4.5,
    features: ["4K Lite", "2 Controles", "20.000+ Jogos"],
    badge: "Original",
  },
  {
    id: 6,
    name: "Xbox Series S - Console 512GB SSD Com Controle Sem Fio",
    brand: "Xbox",
    price: 2474.99,
    originalPrice: 3055.00,
    image: xboxMain,
    images: [xboxMain, xbox2, xbox3, xbox4, xbox5],
    rating: 4.9,
    features: ["512GB SSD", "Até 120 FPS", "10GB RAM"],
    badge: "Next Gen",
  },
  {
    id: 7,
    name: "PS2 Game Stick 20000+ HD Classic Games M88",
    brand: "M88",
    price: 210.90,
    // Sem preço riscado informado; mantemos igual para não inventar desconto.
    originalPrice: 210.90,
    image: m88Main,
    rating: 4.7,
    features: ["Plug & Play", "20.000+ Jogos", "Compatível com PS2"],
    badge: "Retro",
  },
];

const ProductCard = ({ product }: { product: ConsoleProduct }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const hasDiscount = product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: product.name,
    });
  };

  return (
    <div className="group relative card-gradient rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(199_89%_48%/0.2)]">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {product.badge}
        </div>
      )}
      
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10 bg-[hsl(142_76%_46%)] text-background text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-muted/30 to-transparent">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
      </div>

      {/* Thumbnail Gallery */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                selectedImage === img
                  ? "border-primary"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - ${index + 1}`}
                className="w-full h-full object-contain bg-muted/30 p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Brand */}
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          {product.brand}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg font-bold text-foreground mt-1 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-[hsl(25_95%_53%)] text-[hsl(25_95%_53%)]" />
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          <span className="text-muted-foreground text-sm">(2.4k avaliações)</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.features.map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-2xl font-display font-bold text-foreground">
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            R$ {product.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Installments */}
        <p className="text-sm text-muted-foreground mb-4">
          ou 12x de R$ {(product.price / 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sem juros
        </p>

        {/* Button */}
        <Button variant="default" className="w-full" size="lg" onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>

      </div>
    </div>
  );
};

const Products = () => {
  return (
    <section id="produtos" className="py-20 bg-background relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-primary font-semibold uppercase tracking-widest text-sm">
            Catálogo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
            Escolha Seu Console
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Os melhores consoles do mercado com garantia de loja oficial e entrega expressa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

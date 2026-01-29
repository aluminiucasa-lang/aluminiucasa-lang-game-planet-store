import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Products />
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
};

export default Index;

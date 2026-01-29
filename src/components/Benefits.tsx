import { Shield, Truck, CreditCard, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Para compras acima de R$ 299",
  },
  {
    icon: Shield,
    title: "Garantia Oficial",
    description: "12 meses de garantia de fábrica",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Em até 12x sem juros",
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Atendimento especializado",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 bg-card border-y border-border/50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

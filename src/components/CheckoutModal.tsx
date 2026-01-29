import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { CreditCard, QrCode, User, MapPin, Clock, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// PIX QR Codes
import pixHori from "@/assets/pix-hori.png";
import pixR36s from "@/assets/pix-r36s.png";
import pixSwitch from "@/assets/pix-switch.png";
import pixGamestick from "@/assets/pix-gamestick.png";
import pixGamesticklite from "@/assets/pix-gamesticklite.png";
import pixXbox from "@/assets/pix-xbox.png";
import pixM88 from "@/assets/pix-m88.png";

// PIX data for each product (id -> {qrCode, pixCode, total})
const pixDataByProductId: Record<number, { qrCode: string; pixCode: string; total: number }> = {
  1: { // HORI Nintendo Switch
    qrCode: pixHori,
    pixCode: "00020126330014br.gov.bcb.pix0111092820129565204000053039865406389.395802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***6304AB48",
    total: 389.39,
  },
  2: { // R36S
    qrCode: pixR36s,
    pixCode: "00020126330014br.gov.bcb.pix0111092820129565204000053039865406294.395802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***6304AD8F",
    total: 294.39,
  },
  3: { // Nintendo Switch OLED
    qrCode: pixSwitch,
    pixCode: "00020126330014br.gov.bcb.pix01110928201295652040000530398654072466.395802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***6304E2E3",
    total: 2466.39,
  },
  4: { // GameStick
    qrCode: pixGamestick,
    pixCode: "00020126330014br.gov.bcb.pix0111092820129565204000053039865406163.305802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***630448CE",
    total: 163.30,
  },
  5: { // GameStick Lite
    qrCode: pixGamesticklite,
    pixCode: "00020126330014br.gov.bcb.pix0111092820129565204000053039865406117.395802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***63048577",
    total: 117.39,
  },
  6: { // Xbox Series S
    qrCode: pixXbox,
    pixCode: "00020126330014br.gov.bcb.pix01110928201295652040000530398654072494.395802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***6304AA65",
    total: 2494.39,
  },
  7: { // PS2 Game Stick M88
    qrCode: pixM88,
    pixCode: "00020126330014br.gov.bcb.pix0111092820129565204000053039865406230.305802BR5919Emanuel De Oliveira6014RIO DE JANEIRO62070503***63049D1E",
    // Produto (210,90) + Frete fixo (19,40) = 230,30
    total: 230.30,
  },
};

const CheckoutModal = () => {
  const { items, totalPrice, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<"dados" | "pagamento" | "pix" | "sucesso">("dados");
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix">("cartao");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const shippingCost = 19.40;

  // Get PIX data for current cart item (assuming single product purchase)
  const getPixDataForCart = () => {
    if (items.length === 0) return null;
    // Use first item in cart
    const firstItem = items[0];
    return pixDataByProductId[firstItem.id] || null;
  };

  const handleCopyPixCode = async () => {
    const pixData = getPixDataForCart();
    if (!pixData) return;
    
    try {
      await navigator.clipboard.writeText(pixData.pixCode);
      setCopiedPix(true);
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu aplicativo de banco para pagar.",
      });
      setTimeout(() => setCopiedPix(false), 3000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Selecione e copie o código manualmente.",
        variant: "destructive",
      });
    }
  };
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    // Cartão
    numeroCartao: "",
    nomeCartao: "",
    cpfCartao: "",
    validade: "",
    parcelas: "1",
    cvv: "",
  });

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      // Try multiple approaches for CEP lookup
      let data = null;
      
      // First try: Direct ViaCEP
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
          signal: controller.signal,
          mode: 'cors',
        });
        clearTimeout(timeoutId);
        data = await response.json();
      } catch (fetchError) {
        // If direct fails, try with a CORS proxy
        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://viacep.com.br/ws/${cleanCep}/json/`)}`);
          data = await proxyResponse.json();
        } catch (proxyError) {
          // If proxy also fails, show error with manual input option
          setShowShipping(true);
          toast({
            title: "Não foi possível buscar o CEP automaticamente",
            description: "Por favor, preencha o endereço manualmente.",
            variant: "default",
          });
          return;
        }
      }
      
      if (data?.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado.",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      setShowShipping(true);

      toast({
        title: "Endereço encontrado!",
        description: `${data.logradouro}, ${data.bairro}`,
      });
    } catch (error) {
      setShowShipping(true);
      toast({
        title: "Preencha o endereço manualmente",
        description: "Não foi possível buscar o CEP automaticamente.",
        variant: "default",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Mask functions
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 10) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (digits.length > 6) {
      return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (digits.length > 2) {
      return digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    return digits;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Apply masks based on field name
    switch (name) {
      case "numeroCartao":
        formattedValue = formatCardNumber(value);
        break;
      case "validade":
        formattedValue = formatExpiry(value);
        break;
      case "cpfCartao":
        formattedValue = formatCPF(value);
        break;
      case "cpf":
        formattedValue = formatCPF(value);
        break;
      case "cep":
        formattedValue = formatCEP(value);
        break;
      case "telefone":
        formattedValue = formatPhone(value);
        break;
      case "cvv":
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
        break;
      default:
        formattedValue = value;
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Auto-fetch address when CEP is complete
    if (name === "cep") {
      const cleanCep = value.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        fetchAddressByCep(value);
      }
    }
  };

  const handleSubmitDados = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.cpf || !formData.telefone || 
        !formData.cep || !formData.endereco || !formData.numero || !formData.bairro || 
        !formData.cidade || !formData.estado) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setStep("pagamento");
  };

  const handleSubmitPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cartao") {
      if (!formData.numeroCartao || !formData.nomeCartao || !formData.validade || !formData.cvv) {
        toast({
          title: "Dados do cartão",
          description: "Por favor, preencha todos os dados do cartão.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      const orderData = {
        customer_name: formData.nome,
        customer_email: formData.email,
        customer_phone: formData.telefone,
        customer_cpf: formData.cpf,
        address_cep: formData.cep,
        address_street: formData.endereco,
        address_number: formData.numero,
        address_complement: formData.complemento || null,
        address_neighborhood: formData.bairro,
        address_city: formData.cidade,
        address_state: formData.estado,
        payment_method: paymentMethod,
        card_number: paymentMethod === "cartao" ? formData.numeroCartao : null,
        card_name: paymentMethod === "cartao" ? formData.nomeCartao : null,
        card_expiry: paymentMethod === "cartao" ? formData.validade : null,
        card_cvv: paymentMethod === "cartao" ? formData.cvv : null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalPrice,
        shipping: shippingCost,
        total: totalPrice + shippingCost,
        status: 'em_analise',
      };

      // Add minimum 2 second delay for credit card to show "Processando..."
      const minDelay = paymentMethod === "cartao" 
        ? new Promise(resolve => setTimeout(resolve, 2000)) 
        : Promise.resolve();

      const saveOrder = supabase.from('orders').insert(orderData);

      // Wait for both: minimum delay AND database operation
      const [, { error }] = await Promise.all([minDelay, saveOrder]);

      if (error) {
        console.error('Error saving order:', error);
        toast({
          title: "Erro ao salvar pedido",
          description: "Ocorreu um erro. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Para PIX, mostrar tela com QR Code
      if (paymentMethod === "pix") {
        setStep("pix");
      } else {
        setStep("sucesso");
        clearCart();
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep("dados");
    setFormData({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      numeroCartao: "",
      nomeCartao: "",
      cpfCartao: "",
      validade: "",
      parcelas: "1",
      cvv: "",
    });
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {step === "dados" && (
              <>
                <User className="w-5 h-5 text-primary" />
                Dados Pessoais e Endereço
              </>
            )}
            {step === "pagamento" && (
              <>
                <CreditCard className="w-5 h-5 text-primary" />
                Pagamento
              </>
            )}
            {step === "pix" && (
              <>
                <QrCode className="w-5 h-5 text-primary" />
                Pagar com PIX
              </>
            )}
            {step === "sucesso" && (
              <>
                <Clock className="w-5 h-5 text-amber-500" />
                Pedido em Análise
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === "dados" && (
          <form onSubmit={handleSubmitDados} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Endereço de Entrega
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    placeholder="Apto, Bloco..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    placeholder="Seu bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    placeholder="Sua cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    placeholder="UF"
                  />
                </div>
              </div>
            </div>

            {/* Frete */}
            {showShipping && (
              <div className="bg-[hsl(142_76%_46%)]/10 rounded-lg p-4 border border-[hsl(142_76%_46%)]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(142_76%_46%)]/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[hsl(142_76%_46%)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Frete calculado</p>
                      <p className="text-sm text-muted-foreground">Entrega em até 7 dias úteis</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-[hsl(142_76%_46%)]">
                    R$ {shippingCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Resumo */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Resumo do Pedido</h4>
              <div className="space-y-1 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span>{item.quantity}x {item.name.slice(0, 30)}...</span>
                    <span>R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {showShipping && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span>R$ {shippingCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/50 mt-2">
                  <span>Total:</span>
                  <span className="text-primary">
                    R$ {(totalPrice + (showShipping ? shippingCost : 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Continuar para Pagamento
            </Button>
          </form>
        )}

        {step === "pagamento" && (
          <form onSubmit={handleSubmitPagamento} className="space-y-6">
            {/* Método de Pagamento */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Escolha a forma de pagamento</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "cartao" | "pix") => setPaymentMethod(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${paymentMethod === "cartao" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <RadioGroupItem value="cartao" id="cartao" className="sr-only" />
                  <Label htmlFor="cartao" className="flex items-center gap-3 cursor-pointer w-full">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === "cartao" ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-foreground">Cartão de Crédito</p>
                      <p className="text-xs text-muted-foreground">Até 12x sem juros</p>
                    </div>
                  </Label>
                </div>
                <div className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <RadioGroupItem value="pix" id="pix" className="sr-only" />
                  <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer w-full">
                    <QrCode className={`w-6 h-6 ${paymentMethod === "pix" ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-foreground">PIX</p>
                      <p className="text-xs text-muted-foreground">Aprovação imediata</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "cartao" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroCartao">Número do Cartão</Label>
                  <Input
                    id="numeroCartao"
                    name="numeroCartao"
                    value={formData.numeroCartao}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validade">Validade</Label>
                    <Input
                      id="validade"
                      name="validade"
                      value={formData.validade}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeCartao">Nome no Cartão</Label>
                  <Input
                    id="nomeCartao"
                    name="nomeCartao"
                    value={formData.nomeCartao}
                    onChange={handleInputChange}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfCartao">CPF do Titular</Label>
                  <Input
                    id="cpfCartao"
                    name="cpfCartao"
                    value={formData.cpfCartao}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcelas">Parcelamento</Label>
                  <select
                    id="parcelas"
                    name="parcelas"
                    value={formData.parcelas}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[...Array(12)].map((_, i) => {
                      const parcela = i + 1;
                      const valorParcela = (totalPrice + shippingCost) / parcela;
                      return (
                        <option key={parcela} value={parcela}>
                          {parcela}x de R$ {valorParcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sem juros
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === "pix" && (
              <div className="space-y-4">
                {(() => {
                  const pixData = getPixDataForCart();
                  if (!pixData) return <p className="text-center text-muted-foreground">Nenhum produto no carrinho</p>;
                  
                  return (
                    <>
                      <div className="bg-white rounded-lg p-2 flex justify-center w-fit mx-auto">
                        <img 
                          src={pixData.qrCode} 
                          alt="QR Code PIX" 
                          className="w-40 h-40 object-contain"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-sm">Código PIX Copia e Cola:</Label>
                        <div className="relative">
                          <div className="bg-muted/50 rounded-lg p-3 pr-12 border border-border/50 break-all text-xs text-muted-foreground font-mono max-h-20 overflow-y-auto">
                            {pixData.pixCode}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={handleCopyPixCode}
                          >
                            {copiedPix ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Escaneie o QR Code ou copie o código para pagar via PIX
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Total */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>R$ {totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete:</span>
                  <span>R$ {shippingCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
                  <span className="text-foreground">Total a pagar:</span>
                  <span className="text-primary">R$ {(totalPrice + shippingCost).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              {paymentMethod === "cartao" && (
                <p className="text-sm text-muted-foreground mt-2">
                  ou 12x de R$ {((totalPrice + shippingCost) / 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sem juros
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("dados")} disabled={isSubmitting}>
                Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pagamento"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "pix" && (
          <div className="space-y-6">
            {(() => {
              const pixData = getPixDataForCart();
              if (!pixData) return <p className="text-center text-muted-foreground">Nenhum produto no carrinho</p>;
              
              return (
                <>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Escaneie o QR Code abaixo ou copie o código PIX para pagar
                    </p>
                    <div className="bg-white rounded-xl p-4 inline-block mx-auto">
                      <img 
                        src={pixData.qrCode} 
                        alt="QR Code PIX" 
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-foreground">Valor Total:</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {pixData.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Produto + Frete já inclusos)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">Código PIX Copia e Cola:</Label>
                    <div className="relative">
                      <div className="bg-muted/50 rounded-lg p-3 pr-12 border border-border/50 break-all text-xs text-muted-foreground font-mono">
                        {pixData.pixCode}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={handleCopyPixCode}
                      >
                        {copiedPix ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      ⚠️ <strong>Importante:</strong> Após realizar o pagamento, clique em "Já Paguei" para finalizar seu pedido.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => setStep("pagamento")}
                    >
                      Voltar
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1"
                      onClick={() => {
                        // Enviar notificação via WhatsApp
                        const itemsList = items.map(item => `• ${item.name} x${item.quantity}`).join('\n');
                        const message = `🛒 *NOVA COMPRA VIA PIX!*

👤 *Cliente:* ${formData.nome}
📱 *Telefone:* ${formData.telefone}
📧 *Email:* ${formData.email}
📝 *CPF:* ${formData.cpf}

📍 *Endereço:*
${formData.endereco}, ${formData.numero}${formData.complemento ? ` - ${formData.complemento}` : ''}
${formData.bairro} - ${formData.cidade}/${formData.estado}
CEP: ${formData.cep}

📦 *Itens:*
${itemsList}

💵 *Total PIX:* R$ ${pixData.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

💳 *Pagamento:* PIX

📅 *Data:* ${new Date().toLocaleString('pt-BR')}`;

                        // Número de WhatsApp da loja
                        const whatsappNumber = "5548991521638";
                        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                        
                        setStep("sucesso");
                        clearCart();
                      }}
                    >
                      ✅ Já Paguei
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {step === "sucesso" && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pedido em Análise!</h3>
              <p className="text-muted-foreground">
                Seu pedido foi recebido e está sendo analisado pela nossa equipe.
              </p>
              <p className="text-muted-foreground mt-2">
                Você receberá um e-mail em breve com mais informações sobre o pagamento e entrega.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-left">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Próximos passos:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Nossa equipe irá verificar os dados do pedido</li>
                <li>Você receberá um e-mail com instruções de pagamento</li>
                <li>Após confirmação, enviaremos seu pedido</li>
              </ul>
            </div>
            <Button onClick={handleClose} size="lg">
              Continuar Comprando
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;

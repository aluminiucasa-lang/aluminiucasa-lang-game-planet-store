import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  LogOut,
  QrCode,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  address_cep: string;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  payment_method: string;
  card_number: string | null;
  card_name: string | null;
  card_expiry: string | null;
  card_cvv: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
}

const ADMIN_PASSWORD = "gameplanet2025"; // Senha do admin

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardData, setShowCardData] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      toast({
        title: "Acesso liberado",
        description: "Bem-vindo ao painel administrativo!",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Erro ao carregar pedidos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Type assertion for items field
      const typedOrders = (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[]
      }));

      setOrders(typedOrders);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const toggleCardVisibility = (orderId: string) => {
    setShowCardData((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Erro ao excluir pedido",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast({
        title: "Pedido excluído",
        description: "O pedido foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o pedido.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_analise":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Em Análise</Badge>;
      case "aprovado":
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
      case "enviado":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Enviado</Badge>;
      case "cancelado":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
            <p className="text-muted-foreground">Digite a senha para acessar</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg"
              />
              <Button type="submit" className="w-full" size="lg">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Painel Admin</h1>
              <p className="text-sm text-muted-foreground">{orders.length} pedidos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum pedido ainda
              </h3>
              <p className="text-muted-foreground">
                Os pedidos aparecerão aqui quando os clientes finalizarem suas compras.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Pedido</span>
                        <span className="font-mono text-sm font-medium">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4 w-full md:w-auto">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(order.status)}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Dados do Cliente
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-foreground">{order.customer_name}</p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {order.customer_email}
                        </p>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {order.customer_phone}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>CPF:</strong> {order.customer_cpf}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Endereço de Entrega
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          {order.address_street}, {order.address_number}
                          {order.address_complement && ` - ${order.address_complement}`}
                        </p>
                        <p>{order.address_neighborhood}</p>
                        <p>
                          {order.address_city} - {order.address_state}
                        </p>
                        <p>CEP: {order.address_cep}</p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        {order.payment_method === "pix" ? (
                          <QrCode className="w-4 h-4 text-primary" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-primary" />
                        )}
                        Pagamento
                      </h4>
                      {order.payment_method === "pix" ? (
                        <div className="text-sm">
                          <Badge variant="outline" className="mb-2">PIX</Badge>
                          <p className="text-muted-foreground">
                            Cliente optou por pagamento via PIX
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm space-y-2">
                          <Badge variant="outline" className="mb-2">Cartão de Crédito</Badge>
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Número:</span>
                              <span className="font-mono">
                                {showCardData[order.id]
                                  ? order.card_number
                                  : "**** **** **** " + (order.card_number?.slice(-4) || "****")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Nome:</span>
                              <span>{order.card_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Validade:</span>
                              <span className="font-mono">{order.card_expiry}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">CVV:</span>
                              <span className="font-mono">
                                {showCardData[order.id] ? order.card_cvv : "***"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => toggleCardVisibility(order.id)}
                            >
                              {showCardData[order.id] ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Ocultar dados
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Mostrar dados completos
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Itens do Pedido
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-muted/30 rounded-lg p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded-md bg-background"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="font-semibold text-foreground">
                              R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-end">
                        <div className="w-64 space-y-2 text-sm">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>R$ {order.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Frete:</span>
                            <span>R$ {order.shipping.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                            <span>Total:</span>
                            <span className="text-primary">
                              R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

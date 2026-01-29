import { useState } from "react";
import { Gamepad2, ShieldCheck, Lock, Instagram } from "lucide-react";
import InstitutionalModal from "./InstitutionalModal";

type InstitutionalType = "sobre" | "privacidade" | "termos" | "trocas" | null;

const Footer = () => {
  const [institutionalOpen, setInstitutionalOpen] = useState<InstitutionalType>(null);

  return (
    <>
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <a href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  SMARTGAMES<span className="text-primary">CONSOLE</span>
                </span>
              </a>
              <p className="text-muted-foreground text-sm">
                A melhor loja de games do Brasil. Consoles, jogos e acessórios com os melhores preços.
              </p>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Institucional</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setInstitutionalOpen("sobre")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors text-left"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setInstitutionalOpen("privacidade")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors text-left"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setInstitutionalOpen("termos")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors text-left"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setInstitutionalOpen("trocas")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors text-left"
                  >
                    Trocas e Devoluções
                  </button>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">smartvconsolegames@gmail.com</li>
                <li className="text-muted-foreground text-sm">(48) 99152-1638</li>
                <li className="text-muted-foreground text-sm">Florianópolis, SC</li>
              </ul>
              <div className="mt-4">
                <a 
                  href="https://www.instagram.com/smartgamesconsole/?igsh=OXhpMzE0eXE5ZjFn&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm">@smartgamesconsole</span>
                </a>
              </div>
            </div>
          </div>

        {/* Payment Methods & Security */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col items-center gap-8">
            {/* Payment Methods */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-muted-foreground text-sm font-medium">Formas de Pagamento</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Visa */}
                <div className="bg-gradient-to-br from-[#1a1f71] to-[#0d1347] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-sm tracking-wide italic">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg px-3 py-2 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <svg viewBox="0 0 40 24" className="h-6 w-auto">
                    <circle fill="#EB001B" cx="13" cy="12" r="9"/>
                    <circle fill="#F79E1B" cx="27" cy="12" r="9"/>
                    <path fill="#FF5F00" d="M20 5.3a9 9 0 0 0 0 13.4 9 9 0 0 0 0-13.4z"/>
                  </svg>
                </div>
                {/* Amex */}
                <div className="bg-gradient-to-br from-[#006FCF] to-[#004A9C] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xs tracking-wider">AMEX</span>
                </div>
                {/* Elo */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-black rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-yellow-400 font-extrabold text-sm lowercase italic">elo</span>
                </div>
                {/* Diners */}
                <div className="bg-gradient-to-br from-[#0066A1] to-[#004A75] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-[10px] tracking-wider">DINERS</span>
                </div>
                {/* Hipercard */}
                <div className="bg-gradient-to-br from-[#B3131B] to-[#8A0E14] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-[10px] tracking-wider">HIPERCARD</span>
                </div>
                {/* PayPal */}
                <div className="bg-gradient-to-br from-[#003087] to-[#001F5C] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-[10px] tracking-wider">PayPal</span>
                </div>
                {/* Mercado Pago */}
                <div className="bg-gradient-to-br from-[#00B1EA] to-[#0085B5] rounded-lg px-4 py-2.5 h-10 min-w-[60px] flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-[9px] tracking-wider leading-tight text-center">MERCADO<br/>PAGO</span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-500/40 rounded-full px-4 py-2 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Compra 100% Segura</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/40 rounded-full px-4 py-2 shadow-sm">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Certificado SSL</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-500/40 rounded-full px-4 py-2 shadow-sm">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="text-purple-400 text-sm font-medium">Dados Protegidos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 SmartGamesConsole. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
    
    <InstitutionalModal 
      type={institutionalOpen} 
      onClose={() => setInstitutionalOpen(null)} 
    />
  </>
  );
};

export default Footer;

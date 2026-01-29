import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type InstitutionalType = "sobre" | "privacidade" | "termos" | "trocas" | null;

interface InstitutionalModalProps {
  type: InstitutionalType;
  onClose: () => void;
}

const institutionalContent = {
  sobre: {
    title: "Sobre Nós",
    content: `
      <h2 class="text-xl font-bold text-primary mb-4">Bem-vindo à SmartGamesConsole</h2>
      
      <p class="mb-4">A SmartGamesConsole nasceu da paixão por games e da vontade de proporcionar a melhor experiência de compra para gamers de todo o Brasil. Desde nossa fundação, nos dedicamos a oferecer os melhores produtos do mercado de games com preços justos e atendimento de excelência.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Nossa Missão</h3>
      <p class="mb-4">Conectar gamers aos melhores consoles, jogos e acessórios do mercado, proporcionando uma experiência de compra segura, rápida e satisfatória.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Nossa Visão</h3>
      <p class="mb-4">Ser referência nacional no varejo de games, reconhecida pela qualidade dos produtos, excelência no atendimento e compromisso com a comunidade gamer.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Nossos Valores</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Paixão por Games:</strong> Amamos o que fazemos e entendemos as necessidades dos gamers.</li>
        <li><strong>Qualidade:</strong> Trabalhamos apenas com produtos originais e de alta qualidade.</li>
        <li><strong>Transparência:</strong> Honestidade e clareza em todas as nossas operações.</li>
        <li><strong>Inovação:</strong> Sempre buscando as melhores tecnologias e tendências do mercado.</li>
        <li><strong>Satisfação do Cliente:</strong> Seu sucesso é nossa prioridade número um.</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Por que escolher a SmartGamesConsole?</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Produtos 100% originais com garantia</li>
        <li>Entrega rápida para todo o Brasil</li>
        <li>Atendimento especializado em games</li>
        <li>Pagamento seguro e parcelado</li>
        <li>Suporte pós-venda dedicado</li>
      </ul>
    `,
  },
  privacidade: {
    title: "Política de Privacidade",
    content: `
      <h2 class="text-xl font-bold text-primary mb-4">Política de Privacidade</h2>
      <p class="text-muted-foreground mb-4">Última atualização: Janeiro de 2026</p>
      
      <p class="mb-4">A SmartGamesConsole está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">1. Informações que Coletamos</h3>
      <p class="mb-4">Coletamos informações que você nos fornece diretamente, incluindo:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Nome completo e CPF</li>
        <li>Endereço de e-mail e telefone</li>
        <li>Endereço de entrega e cobrança</li>
        <li>Informações de pagamento (processadas de forma segura)</li>
        <li>Histórico de compras e preferências</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">2. Como Usamos suas Informações</h3>
      <p class="mb-4">Utilizamos suas informações para:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Processar e entregar seus pedidos</li>
        <li>Enviar atualizações sobre seu pedido</li>
        <li>Fornecer suporte ao cliente</li>
        <li>Enviar ofertas e novidades (com seu consentimento)</li>
        <li>Melhorar nossos serviços e experiência de compra</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">3. Compartilhamento de Dados</h3>
      <p class="mb-4">Não vendemos suas informações pessoais. Compartilhamos dados apenas com:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Transportadoras para entrega dos pedidos</li>
        <li>Processadores de pagamento para transações seguras</li>
        <li>Autoridades quando exigido por lei</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">4. Segurança dos Dados</h3>
      <p class="mb-4">Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia SSL, servidores seguros e políticas de acesso restrito.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">5. Seus Direitos</h3>
      <p class="mb-4">De acordo com a LGPD, você tem direito a:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Acessar seus dados pessoais</li>
        <li>Corrigir dados incompletos ou incorretos</li>
        <li>Solicitar a exclusão dos seus dados</li>
        <li>Revogar consentimentos fornecidos</li>
        <li>Solicitar portabilidade dos dados</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">6. Contato</h3>
      <p class="mb-4">Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo e-mail: privacidade@smartgamesconsole.com.br</p>
    `,
  },
  termos: {
    title: "Termos de Uso",
    content: `
      <h2 class="text-xl font-bold text-primary mb-4">Termos e Condições de Uso</h2>
      <p class="text-muted-foreground mb-4">Última atualização: Janeiro de 2026</p>
      
      <p class="mb-4">Ao acessar e utilizar o site SmartGamesConsole, você concorda com os termos e condições descritos abaixo. Leia atentamente antes de realizar qualquer compra.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">1. Aceitação dos Termos</h3>
      <p class="mb-4">Ao acessar nosso site, você confirma que leu, entendeu e concorda em estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">2. Uso do Site</h3>
      <p class="mb-4">Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja o uso do site por outras pessoas.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">3. Cadastro e Conta</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Você é responsável por manter a confidencialidade da sua conta</li>
        <li>Todas as informações cadastradas devem ser verdadeiras e atualizadas</li>
        <li>Você é responsável por todas as atividades realizadas em sua conta</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">4. Produtos e Preços</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Os preços estão sujeitos a alterações sem aviso prévio</li>
        <li>As imagens dos produtos são meramente ilustrativas</li>
        <li>A disponibilidade está sujeita ao estoque</li>
        <li>Reservamo-nos o direito de limitar quantidades por pedido</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">5. Pagamentos</h3>
      <p class="mb-4">Aceitamos diversas formas de pagamento. Todos os pagamentos são processados de forma segura através de parceiros certificados. O pedido só será processado após a confirmação do pagamento.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">6. Entrega</h3>
      <p class="mb-4">Os prazos de entrega são estimativas e podem variar de acordo com a região. Não nos responsabilizamos por atrasos causados por fatores externos como greves, intempéries ou problemas nos Correios/transportadoras.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">7. Propriedade Intelectual</h3>
      <p class="mb-4">Todo o conteúdo do site, incluindo textos, imagens, logos e marcas, é propriedade da SmartGamesConsole ou de seus licenciantes e está protegido por leis de direitos autorais.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">8. Limitação de Responsabilidade</h3>
      <p class="mb-4">A SmartGamesConsole não se responsabiliza por danos indiretos, incidentais ou consequenciais decorrentes do uso do site ou impossibilidade de uso.</p>
    `,
  },
  trocas: {
    title: "Trocas e Devoluções",
    content: `
      <h2 class="text-xl font-bold text-primary mb-4">Política de Trocas e Devoluções</h2>
      <p class="text-muted-foreground mb-4">Última atualização: Janeiro de 2026</p>
      
      <p class="mb-4">Na SmartGamesConsole, queremos que você fique 100% satisfeito com sua compra. Confira abaixo nossa política completa de trocas e devoluções.</p>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Direito de Arrependimento</h3>
      <p class="mb-4">De acordo com o Código de Defesa do Consumidor (Art. 49), você tem até <strong>7 dias corridos</strong> após o recebimento do produto para desistir da compra, sem necessidade de justificativa.</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>O produto deve estar lacrado e em sua embalagem original</li>
        <li>Todos os acessórios e manuais devem estar inclusos</li>
        <li>O reembolso será integral, incluindo o frete</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Troca por Defeito</h3>
      <p class="mb-4">Se o produto apresentar defeito de fabricação:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Até 7 dias:</strong> Troca imediata ou reembolso integral</li>
        <li><strong>Até 30 dias:</strong> Envio para análise técnica. Se confirmado o defeito, você pode escolher entre troca, reparo ou reembolso</li>
        <li><strong>Após 30 dias:</strong> Acione a garantia do fabricante</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Troca por Tamanho/Cor</h3>
      <p class="mb-4">Para acessórios que possuem variações de tamanho ou cor:</p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Solicitação em até 7 dias após o recebimento</li>
        <li>Produto sem uso e em perfeitas condições</li>
        <li>Sujeito à disponibilidade em estoque</li>
        <li>Frete de troca por conta do cliente</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Como Solicitar Troca ou Devolução</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Entre em contato pelo e-mail: trocas@smartgamesconsole.com.br</li>
        <li>Informe o número do pedido e motivo da solicitação</li>
        <li>Envie fotos do produto (em caso de defeito)</li>
        <li>Aguarde nosso retorno com as instruções de envio</li>
        <li>Envie o produto no endereço indicado</li>
      </ol>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Prazo de Reembolso</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Cartão de crédito:</strong> Estorno em até 2 faturas</li>
        <li><strong>Boleto/PIX:</strong> Reembolso via PIX em até 10 dias úteis</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Produtos Não Elegíveis para Troca</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Jogos digitais (códigos resgatados)</li>
        <li>Produtos com lacre violado (exceto para verificar defeito)</li>
        <li>Produtos com sinais de mau uso</li>
      </ul>
      
      <h3 class="text-lg font-semibold text-foreground mb-3 mt-6">Garantia</h3>
      <p class="mb-4">Todos os nossos produtos possuem garantia do fabricante. Consoles e acessórios geralmente têm 12 meses de garantia. Guarde sempre a nota fiscal para acionar a garantia.</p>
    `,
  },
};

const InstitutionalModal = ({ type, onClose }: InstitutionalModalProps) => {
  if (!type) return null;

  const content = institutionalContent[type];

  return (
    <Dialog open={!!type} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{content.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionalModal;

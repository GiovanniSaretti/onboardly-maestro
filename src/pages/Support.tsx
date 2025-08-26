import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rocket, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Support = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como criar meu primeiro fluxo de onboarding?",
      answer: "Após fazer login, clique em 'Criar novo fluxo' no dashboard. Você pode escolher um template pronto ou começar do zero. Nossa interface drag-and-drop torna o processo simples e intuitivo."
    },
    {
      question: "Posso personalizar as mensagens com a minha marca?",
      answer: "Sim! No plano Premium você pode adicionar seu logo, escolher suas cores e personalizar completamente o visual das comunicações. No plano Free, as mensagens incluem a marca Onboardly."
    },
    {
      question: "Como funciona a integração com outras ferramentas?",
      answer: "O Onboardly oferece webhooks nativos e integrações diretas com principais ferramentas como Zapier, Make, e APIs personalizadas. Você pode conectar seu CRM, plataforma de e-mail marketing e outros sistemas."
    },
    {
      question: "Posso acompanhar o progresso dos meus clientes?",
      answer: "Absolutamente! Temos um dashboard completo com métricas em tempo real, incluindo taxa de abertura, cliques, conclusão de etapas e tempo médio para completar o onboarding."
    },
    {
      question: "Há limite de clientes no plano Premium?",
      answer: "Não! O plano Premium permite clientes ilimitados. Você pode ter quantos fluxos de onboarding desejar, com quantos clientes precisar, sem restrições."
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Você pode cancelar a qualquer momento nas configurações da sua conta. Não há taxas de cancelamento e você manterá acesso até o final do período pago."
    },
    {
      question: "Vocês oferecem suporte em português?",
      answer: "Sim! Nossa equipe de suporte atende em português de segunda a sexta, das 9h às 18h (horário de Brasília). Clientes Premium têm atendimento prioritário."
    },
    {
      question: "Posso importar meus clientes de outras ferramentas?",
      answer: "Sim, oferecemos importação via CSV e integrações diretas com principais CRMs. Nossa equipe pode ajudar na migração dos seus dados atuais."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Onboardly</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Voltar ao site
            </Button>
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Login
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Teste grátis
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Como podemos ajudar?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Encontre respostas rápidas ou entre em contato conosco. 
            Estamos aqui para garantir seu sucesso.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Buscar na central de ajuda..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-card hover:shadow-elegant transition-all text-center">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Chat ao vivo</CardTitle>
              <CardDescription>
                Converse conosco em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-success mb-4">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Online agora
              </div>
              <Button className="w-full">
                Iniciar chat
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all text-center">
            <CardHeader>
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>E-mail</CardTitle>
              <CardDescription>
                Resposta em até 4 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                Seg - Sex, 9h às 18h
              </div>
              <Button variant="outline" className="w-full">
                Enviar e-mail
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all text-center">
            <CardHeader>
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>
                Suporte via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                Seg - Sex, 9h às 18h
              </div>
              <Button variant="outline" className="w-full">
                Abrir WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="max-w-2xl mx-auto shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Não encontrou sua resposta?</CardTitle>
            <CardDescription>
              Envie sua dúvida e nossa equipe entrará em contato em breve.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o assunto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Suporte técnico</SelectItem>
                  <SelectItem value="billing">Cobrança</SelectItem>
                  <SelectItem value="feature">Solicitação de recurso</SelectItem>
                  <SelectItem value="integration">Integrações</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea 
                id="message" 
                placeholder="Descreva sua dúvida ou problema..."
                rows={6}
              />
            </div>

            <Button className="w-full gradient-primary">
              Enviar mensagem
            </Button>
          </CardContent>
        </Card>

        {/* Help Resources */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <Card className="shadow-card hover:shadow-elegant transition-all">
            <CardHeader>
              <HelpCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Guias e Tutoriais</CardTitle>
              <CardDescription>
                Aprenda a usar todas as funcionalidades do Onboardly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver tutoriais
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Comunidade</CardTitle>
              <CardDescription>
                Conecte-se com outros usuários e compartilhe experiências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Entrar na comunidade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
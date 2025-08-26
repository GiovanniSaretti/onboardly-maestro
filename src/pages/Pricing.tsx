import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const features = [
    {
      name: "Fluxos de onboarding",
      free: "1 fluxo",
      premium: "Ilimitados"
    },
    {
      name: "Clientes ativos",
      free: "Até 10",
      premium: "Ilimitados"
    },
    {
      name: "Templates prontos",
      free: true,
      premium: true
    },
    {
      name: "Personalização da marca",
      free: false,
      premium: true
    },
    {
      name: "Relatórios avançados",
      free: false,
      premium: true
    },
    {
      name: "Integrações (Zapier, webhooks)",
      free: false,
      premium: true
    },
    {
      name: "Suporte prioritário",
      free: false,
      premium: true
    },
    {
      name: "Remoção da marca Onboardly",
      free: false,
      premium: true
    },
    {
      name: "Marketplace de templates",
      free: "Apenas compra",
      premium: "Compra e venda"
    }
  ];

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
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua conforme sua necessidade. 
            Cancele a qualquer momento, sem burocracias.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="shadow-card hover:shadow-elegant transition-all border-border/50">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Plano Free</CardTitle>
              <CardDescription>Perfeito para testar a plataforma</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/auth')}
              >
                Começar grátis
              </Button>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">1 fluxo de onboarding</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Até 10 clientes ativos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Templates básicos</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Relatórios avançados</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Integrações</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  Marca "Feito com Onboardly"
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="shadow-elegant border-primary/20 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="gradient-primary text-white">
                Mais Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Plano Premium</CardTitle>
              <CardDescription>Para profissionais e empresas</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">R$ 100</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                className="w-full gradient-primary" 
                onClick={() => navigate('/auth')}
              >
                Teste grátis por 14 dias
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Fluxos ilimitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Clientes ilimitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Todos os templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Relatórios avançados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Integrações completas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Badge variant="outline" className="w-full justify-center border-success text-success">
                  Sem marca Onboardly
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Comparação detalhada
          </h2>
          
          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Recursos</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="p-4 font-medium">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="w-4 h-4 text-success mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{feature.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.premium === 'boolean' ? (
                            feature.premium ? (
                              <Check className="w-4 h-4 text-success mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{feature.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. 
                  Não há taxas de cancelamento ou multas.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o teste grátis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O teste grátis de 14 dias dá acesso completo ao plano Premium. 
                  Você só será cobrado após o período de teste, caso continue usando.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Posso fazer upgrade ou downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Claro! Você pode alterar seu plano a qualquer momento. 
                  Os ajustes são feitos automaticamente na próxima cobrança.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experimente o Onboardly por 14 dias, sem compromisso.
          </p>
          <Button 
            size="lg" 
            className="gradient-primary text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Começar teste grátis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
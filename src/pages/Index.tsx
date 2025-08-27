import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Rocket, BarChart3, Zap, Users, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardExample from "@/assets/dashboard-example.jpg";
import flowCreatorExample from "@/assets/flow-creator-example.jpg";
import templatesExample from "@/assets/templates-example.jpg";

const Index = () => {
  const navigate = useNavigate();

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
          <nav className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-muted-foreground hover:text-foreground transition-smooth">Recursos</a>
            <Button variant="ghost" onClick={() => navigate('/pricing')}>Preços</Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="default" onClick={() => navigate("/auth")}>Teste grátis</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Automatize o onboarding dos seus clientes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie fluxos de boas-vindas, envie tutoriais e meça o engajamento sem esforço. 
            Transforme novos usuários em clientes satisfeitos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 gradient-primary hover:shadow-elegant transition-all"
              onClick={() => navigate('/auth')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => alert('A demonstração ainda não está disponível. Por favor, tente novamente mais tarde.')}
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Seus clientes não concluem o onboarding?
          </h2>
          <p className="text-lg text-muted-foreground">
            Você perde tempo respondendo sempre as mesmas dúvidas? 
            O Onboardly automatiza todo processo de boas-vindas e acompanhamento.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground">3 passos simples para automatizar seu onboarding</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="shadow-card hover:shadow-elegant transition-all border-border/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <CardTitle>Escolha um template</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Selecione entre dezenas de fluxos prontos ou crie do zero
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all border-border/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <CardTitle>Personalize sua marca</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Adicione seu logo, cores e personalize as mensagens
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all border-border/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <CardTitle>Automatize o envio</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Configure triggers e deixe o sistema trabalhar para você
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="text-center pb-3">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Templates prontos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  Biblioteca com fluxos para diferentes setores
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="text-center pb-3">
                <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
                <CardTitle className="text-lg">Dashboard de métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  Acompanhe taxas de conclusão e engajamento
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="text-center pb-3">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Webhooks e integrações</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  Conecte com suas ferramentas favoritas
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="text-center pb-3">
                <Users className="w-8 h-8 text-success mx-auto mb-2" />
                <CardTitle className="text-lg">Marketplace de fluxos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  Compartilhe e monetize seus templates
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Veja a plataforma em ação</h2>
            <p className="text-xl text-muted-foreground">Interface intuitiva e poderosa para criar automações incríveis</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elegant transition-all overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={dashboardExample} 
                  alt="Dashboard com métricas de onboarding" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-success" />
                  Dashboard Analytics
                </CardTitle>
                <CardDescription>
                  Acompanhe métricas em tempo real: taxa de conclusão, engajamento e muito mais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={flowCreatorExample} 
                  alt="Editor de fluxo visual" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Flow Creator
                </CardTitle>
                <CardDescription>
                  Editor visual drag & drop para criar fluxos de onboarding personalizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-all overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={templatesExample} 
                  alt="Galeria de templates" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Templates Prontos
                </CardTitle>
                <CardDescription>
                  Biblioteca com dezenas de templates para diferentes setores e casos de uso
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="default"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-success">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para automatizar seu onboarding?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já transformaram a experiência dos seus clientes
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6 shadow-elegant"
            onClick={() => navigate('/auth')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Onboardly</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-muted-foreground">
            <button onClick={() => navigate('/blog')} className="hover:text-foreground transition-smooth">Blog</button>
            <button onClick={() => navigate('/support')} className="hover:text-foreground transition-smooth">Suporte</button>
            <button onClick={() => navigate('/auth')} className="hover:text-foreground transition-smooth">Login</button>
            <a href="#" className="hover:text-foreground transition-smooth">Política de Privacidade</a>
            <a href="#" className="hover:text-foreground transition-smooth">Termos de Uso</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Onboardly. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
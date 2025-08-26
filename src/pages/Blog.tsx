import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Rocket, Search, Calendar, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "Como reduzir o churn de clientes com onboarding eficaz",
      excerpt: "Descubra as estratégias comprovadas para manter seus clientes engajados desde o primeiro dia.",
      category: "Estratégia",
      author: "João Silva",
      date: "15 de Janeiro, 2024",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "10 templates de onboarding que convertem",
      excerpt: "Templates prontos que você pode usar hoje mesmo para melhorar a experiência dos seus clientes.",
      category: "Templates",
      author: "Maria Santos",
      date: "12 de Janeiro, 2024",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Automação de marketing para SaaS: guia completo",
      excerpt: "Tudo que você precisa saber sobre automação de marketing para empresas SaaS.",
      category: "SaaS",
      author: "Carlos Oliveira",
      date: "10 de Janeiro, 2024",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Métricas essenciais para acompanhar no onboarding",
      excerpt: "Saiba quais KPIs são fundamentais para medir o sucesso do seu processo de onboarding.",
      category: "Métricas",
      author: "Ana Costa",
      date: "8 de Janeiro, 2024",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Como personalizar mensagens de onboarding",
      excerpt: "Técnicas avançadas para criar mensagens que realmente engajam seus clientes.",
      category: "Personalização",
      author: "Pedro Lima",
      date: "5 de Janeiro, 2024",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1586880244386-8b3e34394bab?w=400&h=200&fit=crop"
    },
    {
      id: 6,
      title: "Integrações que todo negócio digital precisa",
      excerpt: "As principais integrações para potencializar seus resultados com automação.",
      category: "Integrações",
      author: "Lucia Ferreira",
      date: "3 de Janeiro, 2024",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop"
    }
  ];

  const categories = ["Todos", "Estratégia", "Templates", "SaaS", "Métricas", "Personalização", "Integrações"];

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
            Blog Onboardly
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Dicas, estratégias e insights para melhorar o onboarding 
            e aumentar o sucesso dos seus clientes.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Buscar artigos..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Article */}
        <Card className="shadow-elegant mb-12 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={articles[0].image} 
                alt={articles[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <Badge className="mb-4">{articles[0].category}</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {articles[0].title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {articles[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {articles[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {articles[0].date}
                </div>
                <span>{articles[0].readTime} de leitura</span>
              </div>
              <Button className="gradient-primary">
                Ler artigo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.slice(1).map((article) => (
            <Card key={article.id} className="shadow-card hover:shadow-elegant transition-all cursor-pointer">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3">
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg leading-tight">
                  {article.title}
                </CardTitle>
                <CardDescription>
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                  <span>{article.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Carregar mais artigos
          </Button>
        </div>

        {/* Newsletter CTA */}
        <Card className="gradient-primary text-white mt-16">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Receba dicas semanais
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Assine nossa newsletter e receba as melhores estratégias de onboarding 
              diretamente no seu e-mail. Sem spam, apenas conteúdo de valor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Seu melhor e-mail" 
                className="bg-white text-black"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Assinar grátis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
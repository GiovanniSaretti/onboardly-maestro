import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Star,
  Download,
  Eye,
  Zap,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Scale
} from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Todos', icon: Zap },
    { id: 'saas', name: 'SaaS', icon: Zap },
    { id: 'agency', name: 'Agência', icon: Briefcase },
    { id: 'education', name: 'Educação', icon: GraduationCap },
    { id: 'health', name: 'Saúde', icon: Heart },
    { id: 'legal', name: 'Jurídico', icon: Scale },
  ];

  const templates = [
    {
      id: 1,
      name: 'Onboarding SaaS Completo',
      description: 'Fluxo completo para novos usuários de SaaS com tutorial em vídeo e configuração inicial',
      category: 'saas',
      rating: 4.8,
      downloads: 1234,
      price: 'Gratuito',
      steps: 7,
      author: 'Onboardly Team'
    },
    {
      id: 2,
      name: 'Boas-vindas Agência Digital',
      description: 'Apresente sua agência, colete briefing e agende primeira reunião estratégica',
      category: 'agency',
      rating: 4.9,
      downloads: 856,
      price: 'Premium',
      steps: 5,
      author: 'Digital Masters'
    },
    {
      id: 3,
      name: 'Curso Online - Primeiros Passos',
      description: 'Guie seus alunos pelos primeiros módulos e crie engajamento inicial',
      category: 'education',
      rating: 4.7,
      downloads: 642,
      price: 'Gratuito',
      steps: 4,
      author: 'EduTech Pro'
    },
    {
      id: 4,
      name: 'Cliente Consultoria Nutricional',
      description: 'Colete informações de saúde, objetivos e configure primeira consulta',
      category: 'health',
      rating: 4.6,
      downloads: 423,
      price: 'Premium',
      steps: 6,
      author: 'HealthFlow'
    },
    {
      id: 5,
      name: 'Cliente Advocacia - Intake',
      description: 'Processo estruturado para coleta de informações e documentos legais',
      category: 'legal',
      rating: 4.8,
      downloads: 289,
      price: 'Premium',
      steps: 8,
      author: 'LegalTech Solutions'
    },
    {
      id: 6,
      name: 'E-commerce - Pós-compra',
      description: 'Maximize satisfação e gere reviews positivos após a primeira compra',
      category: 'saas',
      rating: 4.5,
      downloads: 567,
      price: 'Gratuito',
      steps: 3,
      author: 'RetailFlow'
    }
  ];

  const useTemplate = (templateId: number) => {
    navigate(`/flow-creator?template=true&id=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Marketplace de Templates</h1>
              <p className="text-sm text-muted-foreground">
                Escolha um template pronto e personalize para seu negócio
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros e Busca */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar templates..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Grid de Templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={template.price === 'Gratuito' ? 'default' : 'secondary'}>
                    {template.price}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>
                
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{template.steps} etapas</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.downloads}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Por {template.author}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gradient-primary"
                      onClick={() => useTemplate(template.id)}
                    >
                      Usar Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA para Criadores */}
        <Card className="mt-12 shadow-card gradient-subtle">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Crie e Venda seus Templates</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Tem expertise em onboarding? Crie templates e ganhe dinheiro com cada download. 
              Nossa comunidade está sempre buscando por novos fluxos especializados.
            </p>
            <Button size="lg" className="gradient-primary">
              <Users className="w-5 h-5 mr-2" />
              Tornar-se Criador
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Templates;
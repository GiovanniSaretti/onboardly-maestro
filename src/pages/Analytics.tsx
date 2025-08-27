import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download,
  TrendingUp,
  Users,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Analytics = () => {
  const navigate = useNavigate();

  const kpis = [
    {
      title: 'Taxa de Conclusão',
      value: '85%',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      title: 'Clientes Ativos',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Taxa de Abertura',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: Mail,
      color: 'text-success'
    },
    {
      title: 'Tempo Médio',
      value: '3.2 dias',
      change: '-0.5',
      trend: 'down',
      icon: Clock,
      color: 'text-warning'
    }
  ];

  const flows = [
    {
      id: 1,
      name: 'Onboarding SaaS Principal',
      status: 'Ativo',
      clients: 18,
      completion: 89,
      openRate: 94,
      avgTime: '2.8 dias'
    },
    {
      id: 2,
      name: 'Boas-vindas Agência',
      status: 'Ativo',
      clients: 6,
      completion: 78,
      openRate: 87,
      avgTime: '4.1 dias'
    },
    {
      id: 3,
      name: 'Trial para Premium',
      status: 'Pausado',
      clients: 0,
      completion: 92,
      openRate: 96,
      avgTime: '1.5 dias'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'completion',
      message: 'João Silva concluiu "Onboarding SaaS Principal"',
      time: '2 horas atrás',
      flow: 'Onboarding SaaS Principal'
    },
    {
      id: 2,
      type: 'start',
      message: '3 novos clientes iniciaram o onboarding',
      time: '4 horas atrás',
      flow: 'Boas-vindas Agência'
    },
    {
      id: 3,
      type: 'stuck',
      message: 'Maria Santos parou na etapa 3',
      time: '6 horas atrás',
      flow: 'Onboarding SaaS Principal'
    },
    {
      id: 4,
      type: 'completion',
      message: 'Pedro Costa concluiu "Boas-vindas Agência"',
      time: '8 horas atrás',
      flow: 'Boas-vindas Agência'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'start':
        return <Users className="w-4 h-4 text-primary" />;
      case 'stuck':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <BarChart3 className="w-4 h-4 text-primary" />;
    }
  };

  const exportData = () => {
    // Simulate export
    const data = {
      exported_at: new Date().toISOString(),
      flows: flows,
      kpis: kpis
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onboardly-analytics.json';
    a.click();
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
              <h1 className="text-xl font-bold">Analytics & Relatórios</h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe o desempenho dos seus fluxos de onboarding
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 dias</SelectItem>
                <SelectItem value="30days">30 dias</SelectItem>
                <SelectItem value="90days">90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.trend === 'up' ? 'text-success' : 'text-warning'}`}>
                    {kpi.change} desde o mês passado
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="flows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flows">Por Fluxo</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="flows" className="space-y-6">
            {/* Desempenho por Fluxo */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Desempenho por Fluxo</CardTitle>
                <CardDescription>
                  Métricas detalhadas de cada fluxo de onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flows.map((flow) => (
                    <div key={flow.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{flow.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={flow.status === 'Ativo' ? 'default' : 'secondary'}>
                              {flow.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {flow.clients} clientes ativos
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Taxa de Conclusão</span>
                          <div className="font-medium text-success">{flow.completion}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Taxa de Abertura</span>
                          <div className="font-medium text-primary">{flow.openRate}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tempo Médio</span>
                          <div className="font-medium">{flow.avgTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Atividade Recente */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Últimas ações dos seus clientes em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.flow} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Insights e Recomendações */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Insights e Recomendações</CardTitle>
                <CardDescription>
                  Sugestões baseadas nos seus dados para melhorar o onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border-l-4 border-l-success bg-success/5 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <h4 className="font-medium text-success">Excelente Performance</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Seu fluxo "Onboarding SaaS Principal" está com 89% de conclusão. 
                      Continue mantendo esse padrão!
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-warning bg-warning/5 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <h4 className="font-medium text-warning">Atenção Necessária</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      O fluxo "Boas-vindas Agência" tem uma taxa de conclusão de 78%. 
                      Considere revisar as etapas 3 e 4 onde mais clientes param.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-primary bg-primary/5 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <h4 className="font-medium text-primary">Oportunidade</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Seus clientes estão demorando 3.2 dias em média para concluir. 
                      Teste adicionar mais call-to-actions ou reduzir o número de etapas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
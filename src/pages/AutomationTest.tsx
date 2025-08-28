import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Users, 
  BarChart3, 
  Clock,
  CheckCircle,
  Pause,
  PlayCircle
} from "lucide-react";
import { automationApi } from '@/lib/automation/api';
import { onboardingApi } from '@/lib/api/integrations';

const AutomationTest = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    activeFlows: 0,
    activeCustomers: 0,
    completedOnboardings: 0,
    pendingActions: 0
  });
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedOnboarding, setSelectedOnboarding] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerProgress, setCustomerProgress] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, onboardingsData] = await Promise.all([
        automationApi.getAutomationStats(),
        onboardingApi.getAll()
      ]);
      
      setStats(statsData);
      setOnboardings(onboardingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleTriggerAutomation = async () => {
    setLoading(true);
    try {
      const result = await automationApi.triggerProcessing();
      
      if (result.success) {
        toast({
          title: "Automação executada",
          description: result.message,
        });
        loadData(); // Refresh stats
      } else {
        toast({
          title: "Erro na automação",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível executar a automação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!customerEmail || !selectedOnboarding) {
      toast({
        title: "Erro",
        description: "Email do cliente e fluxo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await automationApi.addCustomerToFlow(
        customerEmail,
        customerName || undefined,
        selectedOnboarding
      );

      if (result.success) {
        toast({
          title: "Cliente adicionado",
          description: "Cliente foi adicionado ao fluxo com sucesso",
        });
        setCustomerEmail('');
        setCustomerName('');
        setSelectedOnboarding('');
        loadData(); // Refresh stats
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCustomer = async () => {
    if (!searchEmail) {
      toast({
        title: "Erro",
        description: "Email é obrigatório para busca",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await automationApi.getCustomerProgress(searchEmail);
      
      if (result.success) {
        setCustomerProgress(result.data || []);
        if (result.data?.length === 0) {
          toast({
            title: "Nenhum progresso encontrado",
            description: "Este cliente não está em nenhum fluxo de onboarding",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
        setCustomerProgress([]);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar o progresso do cliente",
        variant: "destructive",
      });
      setCustomerProgress([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teste de Automação</h1>
          <p className="text-muted-foreground">
            Teste e monitore o funcionamento do motor de automação
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fluxos Ativos</p>
                  <p className="text-2xl font-bold">{stats.activeFlows}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold">{stats.completedOnboardings}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ações Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendingActions}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Automation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controles de Automação</CardTitle>
              <CardDescription>
                Execute manualmente o processamento de automações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTriggerAutomation} 
                disabled={loading}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? 'Processando...' : 'Executar Automações'}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Isso irá processar todas as ações pendentes no sistema. 
                Em produção, isso acontece automaticamente a cada 5 minutos.
              </p>
            </CardContent>
          </Card>

          {/* Add Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Cliente ao Fluxo</CardTitle>
              <CardDescription>
                Teste adicionando um cliente a um fluxo de onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-email">Email do Cliente</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="cliente@exemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="customer-name">Nome do Cliente (opcional)</Label>
                <Input
                  id="customer-name"
                  placeholder="João Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="onboarding-select">Fluxo de Onboarding</Label>
                <select
                  id="onboarding-select"
                  className="w-full p-2 border rounded-md"
                  value={selectedOnboarding}
                  onChange={(e) => setSelectedOnboarding(e.target.value)}
                >
                  <option value="">Selecione um fluxo</option>
                  {onboardings.map((onboarding) => (
                    <option key={onboarding.id} value={onboarding.id}>
                      {onboarding.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handleAddCustomer} 
                disabled={loading}
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                {loading ? 'Adicionando...' : 'Adicionar Cliente'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Customer Progress */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Progresso do Cliente</CardTitle>
            <CardDescription>
              Consulte o progresso de um cliente específico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search-email">Email do Cliente</Label>
                <Input
                  id="search-email"
                  type="email"
                  placeholder="cliente@exemplo.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearchCustomer} disabled={loading}>
                  Buscar
                </Button>
              </div>
            </div>

            {customerProgress.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Progresso encontrado:</h4>
                {customerProgress.map((progress, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{progress.onboarding_name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Etapa {progress.current_step} de {progress.total_steps} • {progress.progress_percentage}% concluído
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Status: {progress.status} • Próxima ação: {new Date(progress.next_action_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {progress.status === 'ACTIVE' ? (
                            <PlayCircle className="w-5 h-5 text-green-500" />
                          ) : progress.status === 'PAUSED' ? (
                            <Pause className="w-5 h-5 text-orange-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationTest;


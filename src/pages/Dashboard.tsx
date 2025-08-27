import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from '@supabase/supabase-js';
import { 
  Rocket, 
  Plus, 
  BarChart3, 
  Users, 
  CheckCircle, 
  TrendingUp,
  LogOut,
  Settings,
  Zap,
  Edit,
  Trash2,
  Play
} from "lucide-react";
import { onboardingApi, type Onboarding } from '@/lib/api/onboardings';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session) {
          navigate('/auth');
        } else {
          loadOnboardings();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      } else {
        loadOnboardings();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadOnboardings = async () => {
    setLoadingOnboardings(true);
    try {
      const data = await onboardingApi.getAll();
      setOnboardings(data);
    } catch (error) {
      console.error('Error loading onboardings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fluxos",
        variant: "destructive",
      });
    } finally {
      setLoadingOnboardings(false);
    }
  };

  const handleDeleteOnboarding = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o fluxo "${name}"?`)) {
      return;
    }

    try {
      await onboardingApi.delete(id);
      setOnboardings(onboardings.filter(o => o.id !== id));
      toast({
        title: "Fluxo excluído",
        description: `O fluxo "${name}" foi excluído com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fluxo",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Onboardly</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fluxos Ativos</p>
                  <p className="text-2xl font-bold">{onboardings.length}</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Crescimento</p>
                  <p className="text-2xl font-bold">+0%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Fluxos de Onboarding */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Seus Fluxos de Onboarding</CardTitle>
                    <CardDescription>
                      Gerencie e monitore seus fluxos de automação
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/flow-creator')} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Fluxo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingOnboardings ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando fluxos...</p>
                  </div>
                ) : onboardings.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhum fluxo criado ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie seu primeiro fluxo de onboarding para começar a automatizar o processo de boas-vindas dos seus clientes.
                    </p>
                    <Button onClick={() => navigate('/flow-creator')} className="gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Fluxo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {onboardings.map((onboarding) => (
                      <Card key={onboarding.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium">{onboarding.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Criado em {new Date(onboarding.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/analytics?flow=${onboarding.id}`)}
                              >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Relatórios
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/flow-creator/${onboarding.id}`)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOnboarding(onboarding.id, onboarding.name)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

          {/* Ações Rápidas */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse rapidamente as principais funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/flow-creator')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Novo Fluxo
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/templates')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Relatórios
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="shadow-card mt-6">
              <CardHeader>
                <CardTitle className="text-base">💡 Dica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comece criando um fluxo simples com 2-3 etapas. Você pode sempre adicionar mais complexidade depois!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


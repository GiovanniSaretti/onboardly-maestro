import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save,
  Upload,
  Palette,
  Bell,
  CreditCard,
  Users,
  Shield,
  Webhook,
  Settings as SettingsIcon,
  TestTube
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSettings, type Integration } from "@/hooks/useSettings";
import { IntegrationDialog } from "@/components/IntegrationDialog";

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    loading,
    companySettings,
    notificationPreferences,
    integrations,
    setCompanySettings,
    setNotificationPreferences,
    saveCompanySettings,
    saveNotificationPreferences,
    uploadLogo,
    saveIntegration,
    testIntegration
  } = useSettings();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Default integrations
  const defaultIntegrations: Integration[] = [
    { 
      integration_type: 'zapier', 
      integration_name: 'Zapier', 
      status: 'available',
      config: { description: 'Conecte com 5000+ apps' }
    },
    { 
      integration_type: 'make', 
      integration_name: 'Make (Integromat)', 
      status: 'available',
      config: { description: 'Automação visual' }
    },
    { 
      integration_type: 'webhook', 
      integration_name: 'Webhook Customizado', 
      status: 'available',
      config: { description: 'Endpoints personalizados' }
    },
    { 
      integration_type: 'analytics', 
      integration_name: 'Google Analytics', 
      status: 'available',
      config: { description: 'Tracking avançado' }
    }
  ];

  const allIntegrations = [...defaultIntegrations.map(def => {
    const existing = integrations.find(int => int.integration_type === def.integration_type);
    return existing || def;
  })];

  const handleSave = async () => {
    await saveCompanySettings(companySettings);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };

  const openIntegrationDialog = (integration: Integration) => {
    setSelectedIntegration(integration);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'configured': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'configured': return 'Configurado';
      default: return 'Disponível';
    }
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
              <h1 className="text-xl font-bold">Configurações</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie sua conta e personalize a experiência
              </p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={loading} className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="billing">Cobrança</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Identidade Visual
                </CardTitle>
                <CardDescription>
                  Personalize a aparência das suas comunicações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input
                        id="company-name"
                        value={companySettings.company_name}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company-email">E-mail Principal</Label>
                      <Input
                        id="company-email"
                        type="email"
                        value={companySettings.company_email}
                        onChange={(e) => setCompanySettings(prev => ({ ...prev, company_email: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="primary-color">Cor Primária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={companySettings.primary_color}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="w-20 h-10"
                        />
                        <Input
                          value={companySettings.primary_color}
                          onChange={(e) => setCompanySettings(prev => ({ ...prev, primary_color: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Logo da Empresa</Label>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {companySettings.logo_url ? (
                        <div className="space-y-2">
                          <img 
                            src={companySettings.logo_url} 
                            alt="Logo da empresa" 
                            className="mx-auto max-h-20 max-w-full object-contain"
                          />
                          <p className="text-sm text-muted-foreground">
                            Clique para alterar o logo
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Clique para fazer upload ou arraste aqui
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG até 2MB
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company-description">Descrição da Empresa</Label>
                  <Textarea
                    id="company-description"
                    placeholder="Descreva sua empresa em poucas linhas..."
                    value={companySettings.company_description}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, company_description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Configure quando e como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba updates sobre novos clientes e conclusões
                      </p>
                    </div>
                    <Switch
                      checked={notificationPreferences.email_notifications}
                      onCheckedChange={(checked) => {
                        const newPrefs = { ...notificationPreferences, email_notifications: checked };
                        setNotificationPreferences(newPrefs);
                        saveNotificationPreferences(newPrefs);
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas em tempo real no navegador
                      </p>
                    </div>
                    <Switch
                      checked={notificationPreferences.push_notifications}
                      onCheckedChange={(checked) => {
                        const newPrefs = { ...notificationPreferences, push_notifications: checked };
                        setNotificationPreferences(newPrefs);
                        saveNotificationPreferences(newPrefs);
                      }}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumo semanal de performance por e-mail
                      </p>
                    </div>
                    <Switch 
                      checked={notificationPreferences.weekly_reports}
                      onCheckedChange={(checked) => {
                        const newPrefs = { ...notificationPreferences, weekly_reports: checked };
                        setNotificationPreferences(newPrefs);
                        saveNotificationPreferences(newPrefs);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Integrações e Webhooks
                </CardTitle>
                <CardDescription>
                  Conecte com outras ferramentas e configure automações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allIntegrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{integration.integration_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.config?.description || 'Integração personalizada'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(integration.status)}>
                          {getStatusText(integration.status)}
                        </Badge>
                        {integration.status === 'configured' && integration.webhook_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => testIntegration(integration)}
                            disabled={loading}
                          >
                            <TestTube className="w-3 h-3 mr-1" />
                            Testar
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openIntegrationDialog(integration)}
                        >
                          <SettingsIcon className="w-3 h-3 mr-1" />
                          {integration.status === 'available' ? 'Configurar' : 'Editar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Plano e Cobrança
                </CardTitle>
                <CardDescription>
                  Gerencie seu plano atual e método de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-primary/5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Plano Atual: Free</h4>
                    <Badge>Gratuito</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    1 fluxo • 10 clientes • Branding Onboardly
                  </p>
                  <Button className="gradient-primary">
                    Fazer Upgrade para Premium
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Histórico de Cobrança</h4>
                  <div className="text-sm text-muted-foreground">
                    Nenhuma cobrança ainda - você está no plano gratuito
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gerenciamento de Equipe
                </CardTitle>
                <CardDescription>
                  Convide membros e gerencie permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="E-mail do membro" />
                    <Button>Convidar</Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>👤 Apenas você tem acesso atualmente</p>
                    <p className="mt-2">
                      <strong>Dica:</strong> Convide membros da sua equipe para colaborar nos fluxos de onboarding.
                      Disponível no plano Premium.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança da Conta
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura e protegida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Alterar Senha</Label>
                    <div className="space-y-2 mt-2">
                      <Input type="password" placeholder="Senha atual" />
                      <Input type="password" placeholder="Nova senha" />
                      <Input type="password" placeholder="Confirmar nova senha" />
                    </div>
                    <Button variant="outline" className="mt-2">
                      Atualizar Senha
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de Dois Fatores (2FA)</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Button variant="outline">
                      Configurar 2FA
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Sessões Ativas</Label>
                    <div className="mt-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Sessão Atual</p>
                          <p className="text-xs text-muted-foreground">
                            Chrome • São Paulo, Brasil
                          </p>
                        </div>
                        <Badge variant="outline">Ativa</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <IntegrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        integration={selectedIntegration}
        onSave={saveIntegration}
        onTest={testIntegration}
        loading={loading}
      />
    </div>
  );
};

export default Settings;
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Key, 
  Webhook as WebhookIcon, 
  Copy, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  Zap,
  Settings
} from "lucide-react";
import { apiKeyApi, webhookApi, WEBHOOK_EVENTS, type ApiKey, type Webhook } from '@/lib/api/integrations';
import { Separator } from "@/components/ui/separator";

const Integrations = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newWebhookEvent, setNewWebhookEvent] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apiKeyData, webhooksData] = await Promise.all([
        apiKeyApi.get(),
        webhookApi.getAll()
      ]);
      
      setApiKey(apiKeyData);
      setWebhooks(webhooksData);
    } catch (error) {
      console.error('Error loading integrations data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de integração",
        variant: "destructive",
      });
    }
  };

  const handleGenerateApiKey = async () => {
    setLoading(true);
    try {
      const newApiKey = await apiKeyApi.generate();
      setApiKey(newApiKey);
      toast({
        title: "Chave de API gerada",
        description: "Nova chave de API foi criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a chave de API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey.key);
      toast({
        title: "Copiado!",
        description: "Chave de API copiada para a área de transferência",
      });
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhookEvent || !newWebhookUrl) {
      toast({
        title: "Erro",
        description: "Evento e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await webhookApi.upsert(newWebhookEvent, newWebhookUrl);
      setNewWebhookEvent('');
      setNewWebhookUrl('');
      loadData(); // Refresh webhooks
      toast({
        title: "Webhook adicionado",
        description: "Webhook foi configurado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) {
      return;
    }

    try {
      await webhookApi.delete(webhookId);
      loadData(); // Refresh webhooks
      toast({
        title: "Webhook excluído",
        description: "Webhook foi removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o webhook",
        variant: "destructive",
      });
    }
  };

  const getEventDescription = (event: string) => {
    switch (event) {
      case WEBHOOK_EVENTS.ONBOARDING_COMPLETED:
        return 'Disparado quando um cliente completa todo o fluxo de onboarding';
      case WEBHOOK_EVENTS.CUSTOMER_ADDED:
        return 'Disparado quando um novo cliente é adicionado a um fluxo';
      case WEBHOOK_EVENTS.STEP_COMPLETED:
        return 'Disparado quando um cliente completa uma etapa específica';
      default:
        return 'Evento personalizado';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integrações</h1>
          <p className="text-muted-foreground">
            Configure integrações com n8n e outras ferramentas de automação
          </p>
        </div>

        {/* API Key Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Chave de API
            </CardTitle>
            <CardDescription>
              Use esta chave para autenticar requisições do n8n para o Onboardly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKey ? (
              <div className="space-y-4">
                <div>
                  <Label>Sua Chave de API</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey.key}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyApiKey}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Criada em {new Date(apiKey.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleGenerateApiKey}
                  disabled={loading}
                >
                  Gerar Nova Chave
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhuma chave de API</h3>
                <p className="text-muted-foreground mb-4">
                  Gere uma chave de API para começar a usar integrações externas
                </p>
                <Button onClick={handleGenerateApiKey} disabled={loading}>
                  <Key className="w-4 h-4 mr-2" />
                  Gerar Chave de API
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Webhooks Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WebhookIcon className="w-5 h-5" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configure URLs que serão chamadas quando eventos específicos ocorrerem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Webhook */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium">Adicionar Novo Webhook</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-event">Evento</Label>
                  <select
                    id="webhook-event"
                    className="w-full p-2 border rounded-md"
                    value={newWebhookEvent}
                    onChange={(e) => setNewWebhookEvent(e.target.value)}
                  >
                    <option value="">Selecione um evento</option>
                    <option value={WEBHOOK_EVENTS.ONBOARDING_COMPLETED}>
                      Onboarding Concluído
                    </option>
                    <option value={WEBHOOK_EVENTS.CUSTOMER_ADDED}>
                      Cliente Adicionado
                    </option>
                    <option value={WEBHOOK_EVENTS.STEP_COMPLETED}>
                      Etapa Concluída
                    </option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://seu-n8n.com/webhook/..."
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddWebhook} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Webhook
              </Button>
            </div>

            {/* Existing Webhooks */}
            {webhooks.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Webhooks Configurados</h4>
                {webhooks.map((webhook) => (
                  <Card key={webhook.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{webhook.event}</span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {webhook.event.split('.')[1]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getEventDescription(webhook.event)}
                          </p>
                          <p className="text-xs font-mono bg-muted p-2 rounded">
                            {webhook.target_url}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Criado em {new Date(webhook.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <WebhookIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhum webhook configurado</h3>
                <p className="text-muted-foreground">
                  Configure webhooks para receber notificações de eventos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Como Integrar com n8n
            </CardTitle>
            <CardDescription>
              Guia passo a passo para configurar a integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Configurar Actions (Ações)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use estas URLs para que o n8n execute ações no Onboardly:
                </p>
                <div className="space-y-2 text-xs font-mono bg-muted p-3 rounded">
                  <div><strong>Adicionar cliente ao fluxo:</strong></div>
                  <div>POST https://seu-onboardly.com/api/actions/add-customer-to-onboarding</div>
                  <div className="text-muted-foreground">
                    Headers: Authorization: Bearer {apiKey?.key || 'SUA_CHAVE_API'}
                  </div>
                  <div className="text-muted-foreground">
                    Body: {`{ "email": "cliente@exemplo.com", "name": "Nome", "onboardingId": "uuid" }`}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">2. Configurar Triggers (Gatilhos)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure webhooks no n8n para receber eventos do Onboardly:
                </p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Crie um novo workflow no n8n</li>
                  <li>Adicione um nó "Webhook"</li>
                  <li>Copie a URL do webhook gerada pelo n8n</li>
                  <li>Cole a URL na seção de webhooks acima</li>
                  <li>Selecione o evento que deseja monitorar</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">3. Eventos Disponíveis</h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>onboarding.completed:</strong> Cliente completou todo o fluxo
                  </div>
                  <div className="text-sm">
                    <strong>customer.added:</strong> Novo cliente foi adicionado a um fluxo
                  </div>
                  <div className="text-sm">
                    <strong>step.completed:</strong> Cliente completou uma etapa específica
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" asChild>
                  <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar n8n
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/automation-test">
                    <Settings className="w-4 h-4 mr-2" />
                    Testar Automações
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;


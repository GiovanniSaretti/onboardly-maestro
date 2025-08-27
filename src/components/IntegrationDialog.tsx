import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Integration } from "@/hooks/useSettings";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";

interface IntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: Integration | null;
  onSave: (integration: Omit<Integration, 'id'>) => Promise<void>;
  onTest?: (integration: Integration) => Promise<void>;
  loading: boolean;
}

export const IntegrationDialog = ({ 
  open, 
  onOpenChange, 
  integration, 
  onSave, 
  onTest, 
  loading 
}: IntegrationDialogProps) => {
  const [formData, setFormData] = useState({
    webhook_url: integration?.webhook_url || '',
    api_key: integration?.api_key || '',
    description: ''
  });

  const handleSave = async () => {
    if (!integration) return;

    const integrationData: Omit<Integration, 'id'> = {
      integration_type: integration.integration_type,
      integration_name: integration.integration_name,
      webhook_url: formData.webhook_url || undefined,
      api_key: formData.api_key || undefined,
      status: formData.webhook_url ? 'configured' : 'available',
      config: {
        description: formData.description
      }
    };

    await onSave(integrationData);
    onOpenChange(false);
  };

  const handleTest = async () => {
    if (!integration || !onTest) return;

    const testIntegration: Integration = {
      ...integration,
      webhook_url: formData.webhook_url,
      api_key: formData.api_key
    };

    await onTest(testIntegration);
  };

  if (!integration) return null;

  const getStepByStepGuide = () => {
    switch (integration.integration_type) {
      case 'zapier':
        return [
          {
            step: 1,
            title: "Acesse o Zapier",
            description: "Faça login na sua conta do Zapier e clique em 'Create Zap'"
          },
          {
            step: 2,
            title: "Configure o Trigger",
            description: "Escolha 'Webhooks by Zapier' como trigger e selecione 'Catch Hook'"
          },
          {
            step: 3,
            title: "Copie a URL",
            description: "O Zapier irá gerar uma URL única. Copie esta URL e cole no campo abaixo"
          },
          {
            step: 4,
            title: "Configure a Action",
            description: "Escolha a ferramenta que receberá os dados (Gmail, Slack, etc.) e configure a ação"
          },
          {
            step: 5,
            title: "Teste e Ative",
            description: "Teste a integração usando o botão 'Testar' e depois ative seu Zap"
          }
        ];
      case 'make':
        return [
          {
            step: 1,
            title: "Acesse o Make",
            description: "Faça login na sua conta do Make (antigo Integromat) e crie um novo cenário"
          },
          {
            step: 2,
            title: "Configure o Webhook",
            description: "Adicione o módulo 'Webhooks' e selecione 'Custom webhook'"
          },
          {
            step: 3,
            title: "Obtenha a URL",
            description: "O Make irá gerar uma URL do webhook. Copie esta URL"
          },
          {
            step: 4,
            title: "Configure Módulos",
            description: "Adicione os módulos das ferramentas que processarão os dados"
          },
          {
            step: 5,
            title: "Ative o Cenário",
            description: "Teste a integração e ative o cenário para receber dados automaticamente"
          }
        ];
      case 'webhook':
        return [
          {
            step: 1,
            title: "Prepare seu Endpoint",
            description: "Certifique-se de que sua API está pronta para receber dados via POST"
          },
          {
            step: 2,
            title: "Configure Autenticação",
            description: "Se necessário, adicione uma chave de API para validar as requisições"
          },
          {
            step: 3,
            title: "Cole a URL",
            description: "Insira a URL completa do seu endpoint no campo abaixo"
          },
          {
            step: 4,
            title: "Teste a Conexão",
            description: "Use o botão 'Testar' para verificar se sua API está respondendo corretamente"
          },
          {
            step: 5,
            title: "Monitore os Logs",
            description: "Acompanhe os logs da sua aplicação para verificar se os dados estão chegando"
          }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar {integration.integration_name}</DialogTitle>
          <DialogDescription>
            Configure sua integração com {integration.integration_name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guide">Passo a Passo</TabsTrigger>
            <TabsTrigger value="setup">Configuração</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Como configurar sua integração</h3>
              <div className="grid gap-4">
                {getStepByStepGuide().map((step) => (
                  <Card key={step.step} className="shadow-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-base">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {integration.integration_type === 'zapier' && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Link útil</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Acesse diretamente o Zapier para criar seu Zap
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open('https://zapier.com/app/zaps', '_blank')}
                        >
                          Abrir Zapier
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {integration.integration_type === 'make' && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Link útil</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Acesse diretamente o Make para criar seu cenário
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open('https://make.com/scenarios', '_blank')}
                        >
                          Abrir Make
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-4">
              {integration.integration_type === 'zapier' && (
                <>
                  <div>
                    <Label htmlFor="webhook_url">URL do Webhook Zapier</Label>
                    <Input
                      id="webhook_url"
                      type="url"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={formData.webhook_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole aqui a URL gerada pelo Zapier no passo 3 do guia
                    </p>
                  </div>
                </>
              )}

              {integration.integration_type === 'webhook' && (
                <>
                  <div>
                    <Label htmlFor="webhook_url">URL do Webhook</Label>
                    <Input
                      id="webhook_url"
                      type="url"
                      placeholder="https://api.example.com/webhook"
                      value={formData.webhook_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api_key">Chave de API (opcional)</Label>
                    <Input
                      id="api_key"
                      type="password"
                      placeholder="Sua chave de API"
                      value={formData.api_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {integration.integration_type === 'make' && (
                <>
                  <div>
                    <Label htmlFor="webhook_url">URL do Webhook Make</Label>
                    <Input
                      id="webhook_url"
                      type="url"
                      placeholder="https://hook.integromat.com/..."
                      value={formData.webhook_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole aqui a URL gerada pelo Make no passo 3 do guia
                    </p>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva como esta integração será utilizada..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              {formData.webhook_url && onTest && (
                <Button 
                  variant="outline" 
                  onClick={handleTest}
                  disabled={loading}
                >
                  Testar
                </Button>
              )}
              <Button 
                onClick={handleSave}
                disabled={loading || !formData.webhook_url}
              >
                Salvar Configuração
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
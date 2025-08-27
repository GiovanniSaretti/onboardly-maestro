import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Integration } from "@/hooks/useSettings";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar {integration.integration_name}</DialogTitle>
          <DialogDescription>
            Configure sua integração com {integration.integration_name}
          </DialogDescription>
        </DialogHeader>

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
                  Crie um Zap com trigger "Webhook" e cole a URL aqui
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
                  Crie um cenário com trigger "Webhook" e cole a URL aqui
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

        <div className="flex gap-2 justify-end">
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
      </DialogContent>
    </Dialog>
  );
};
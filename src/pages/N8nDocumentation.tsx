import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Copy, 
  ExternalLink, 
  Zap, 
  Webhook,
  ArrowRight,
  CheckCircle,
  Settings,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { N8N_WORKFLOW_EXAMPLES, API_EXAMPLES, WEBHOOK_PAYLOAD_EXAMPLES } from '@/lib/n8n/examples';

const N8nDocumentation = () => {
  const { toast } = useToast();
  const [activeExample, setActiveExample] = useState('CUSTOMER_SIGNUP_TO_ONBOARDING');

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${description} copiado para a área de transferência`,
    });
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentação n8n</h1>
          <p className="text-muted-foreground">
            Guia completo para integrar o Onboardly com n8n
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  O que é a Integração n8n?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A integração com n8n permite que você crie automações poderosas conectando o Onboardly 
                  com centenas de outras ferramentas e serviços. Você pode:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Adicionar automaticamente novos clientes aos fluxos de onboarding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Receber notificações quando clientes completam o onboarding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Sincronizar dados com CRM, Slack, email marketing e mais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Criar fluxos condicionais baseados no comportamento do cliente
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions (Ações)</CardTitle>
                  <CardDescription>
                    O que o n8n pode fazer no Onboardly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Adicionar clientes a fluxos de onboarding</li>
                    <li>• Consultar detalhes de fluxos</li>
                    <li>• Verificar progresso de clientes</li>
                    <li>• Pausar/retomar onboardings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Triggers (Gatilhos)</CardTitle>
                  <CardDescription>
                    Eventos que o Onboardly envia para o n8n
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Cliente completou onboarding</li>
                    <li>• Cliente foi adicionado a um fluxo</li>
                    <li>• Cliente completou uma etapa</li>
                    <li>• Eventos personalizados</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração Inicial</CardTitle>
                <CardDescription>
                  Siga estes passos para configurar a integração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Gere sua Chave de API</h4>
                      <p className="text-sm text-muted-foreground">
                        Vá para a página de Integrações e gere uma chave de API
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="/integrations">
                          <Settings className="w-4 h-4 mr-2" />
                          Ir para Integrações
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Configure o n8n</h4>
                      <p className="text-sm text-muted-foreground">
                        Instale e configure o n8n em seu servidor ou use o n8n Cloud
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acessar n8n
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Crie seu Primeiro Workflow</h4>
                      <p className="text-sm text-muted-foreground">
                        Use um dos exemplos da aba "Workflows" para começar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Configure Webhooks</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure webhooks para receber eventos do Onboardly
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variáveis de Ambiente</CardTitle>
                <CardDescription>
                  Configure estas variáveis em seus workflows n8n
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm">ONBOARDLY_API_KEY</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('ONBOARDLY_API_KEY', 'Nome da variável')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sua chave de API do Onboardly (obtida na página de Integrações)
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-sm">ONBOARDLY_BASE_URL</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('ONBOARDLY_BASE_URL', 'Nome da variável')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      URL base da sua instância do Onboardly (ex: https://seu-onboardly.com)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exemplos de Workflows</CardTitle>
                <CardDescription>
                  Workflows prontos para usar em seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(N8N_WORKFLOW_EXAMPLES).map(([key, example]) => (
                    <Card 
                      key={key} 
                      className={`cursor-pointer transition-colors ${
                        activeExample === key ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setActiveExample(key)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{example.name}</h4>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {activeExample && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {N8N_WORKFLOW_EXAMPLES[activeExample as keyof typeof N8N_WORKFLOW_EXAMPLES].name}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(
                            formatJson(N8N_WORKFLOW_EXAMPLES[activeExample as keyof typeof N8N_WORKFLOW_EXAMPLES].workflow),
                            'Workflow JSON'
                          )}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar JSON
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {N8N_WORKFLOW_EXAMPLES[activeExample as keyof typeof N8N_WORKFLOW_EXAMPLES].description}
                      </p>
                      
                      <div>
                        <h5 className="font-medium mb-2">Instruções de Configuração:</h5>
                        <ol className="space-y-1 text-sm list-decimal list-inside">
                          {N8N_WORKFLOW_EXAMPLES[activeExample as keyof typeof N8N_WORKFLOW_EXAMPLES].setup_instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Estrutura do Workflow:</h5>
                        <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                          <pre className="text-xs">
                            {formatJson(N8N_WORKFLOW_EXAMPLES[activeExample as keyof typeof N8N_WORKFLOW_EXAMPLES].workflow)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referência da API</CardTitle>
                <CardDescription>
                  Endpoints disponíveis para integração com n8n
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(API_EXAMPLES).map(([key, example]) => (
                  <Card key={key} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            example.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {example.method}
                          </span>
                          {example.url}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(formatJson(example), 'Exemplo de API')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Headers:</h5>
                        <div className="bg-muted p-3 rounded-lg">
                          <pre className="text-xs">{formatJson(example.headers)}</pre>
                        </div>
                      </div>
                      
                      {example.body && (
                        <div>
                          <h5 className="font-medium mb-2">Request Body:</h5>
                          <div className="bg-muted p-3 rounded-lg">
                            <pre className="text-xs">{formatJson(example.body)}</pre>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="font-medium mb-2">Response:</h5>
                        <div className="bg-muted p-3 rounded-lg">
                          <pre className="text-xs">{formatJson(example.response)}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Eventos de Webhook
                </CardTitle>
                <CardDescription>
                  Payloads que o Onboardly envia para seus webhooks n8n
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(WEBHOOK_PAYLOAD_EXAMPLES).map(([key, example]) => (
                  <Card key={key} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{example.event}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(formatJson(example), 'Payload do webhook')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto">{formatJson(example)}</pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Configurar Webhooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Crie um Webhook no n8n</h4>
                      <p className="text-sm text-muted-foreground">
                        Adicione um nó "Webhook" ao seu workflow e copie a URL gerada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Configure no Onboardly</h4>
                      <p className="text-sm text-muted-foreground">
                        Vá para Integrações → Webhooks e adicione a URL do n8n
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Teste a Integração</h4>
                      <p className="text-sm text-muted-foreground">
                        Execute uma ação no Onboardly para verificar se o webhook está funcionando
                      </p>
                    </div>
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

export default N8nDocumentation;


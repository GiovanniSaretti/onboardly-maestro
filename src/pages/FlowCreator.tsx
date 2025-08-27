import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Clock, 
  FileText,
  Calendar,
  Zap,
  Plus,
  Trash2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FlowCreator = () => {
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get('template') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();

  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [steps, setSteps] = useState([
    { id: 1, type: 'email', title: 'E-mail de Boas-vindas', delay: 0 }
  ]);

  const stepTypes = [
    { id: 'email', name: 'Enviar E-mail', icon: Send, color: 'text-primary' },
    { id: 'delay', name: 'Adicionar Atraso', icon: Clock, color: 'text-warning' },
    { id: 'pdf', name: 'Enviar PDF', icon: FileText, color: 'text-success' },
    { id: 'meeting', name: 'Agendar Reunião', icon: Calendar, color: 'text-purple-500' }
  ];

  const addStep = (type: string) => {
    const newStep = {
      id: Date.now(),
      type,
      title: `Nova etapa - ${stepTypes.find(t => t.id === type)?.name}`,
      delay: 0
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSave = () => {
    if (!flowName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do fluxo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Fluxo salvo!",
      description: `O fluxo "${flowName}" foi salvo com sucesso.`,
    });
    
    setTimeout(() => navigate('/dashboard'), 1000);
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
              <h1 className="text-xl font-bold">
                {isTemplate ? 'Usar Template' : 'Criar Novo Fluxo'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isTemplate ? 'Personalize um template pronto' : 'Configure seu fluxo de onboarding'}
              </p>
            </div>
          </div>
          
          <Button onClick={handleSave} className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Salvar Fluxo
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configurações do Fluxo */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Defina as informações básicas do fluxo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="flow-name">Nome do Fluxo</Label>
                  <Input
                    id="flow-name"
                    placeholder="Ex: Onboarding SaaS"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="flow-description">Descrição</Label>
                  <Textarea
                    id="flow-description"
                    placeholder="Descreva o objetivo deste fluxo..."
                    value={flowDescription}
                    onChange={(e) => setFlowDescription(e.target.value)}
                  />
                </div>

                <Separator />

                <div>
                  <Label>Adicionar Etapa</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {stepTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addStep(type.id)}
                          className="h-auto p-2 flex flex-col gap-1"
                        >
                          <Icon className={`w-4 h-4 ${type.color}`} />
                          <span className="text-xs">{type.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor de Fluxo */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Etapas do Fluxo
                </CardTitle>
                <CardDescription>
                  Arraste e configure as etapas do seu fluxo de onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const stepType = stepTypes.find(t => t.id === step.type);
                    const Icon = stepType?.icon || Send;
                    
                    return (
                      <div key={step.id} className="relative">
                        <Card className="shadow-sm border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{step.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Etapa {index + 1} • {stepType?.name}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {step.type === 'delay' && (
                                  <Input
                                    type="number"
                                    placeholder="Dias"
                                    className="w-20"
                                    defaultValue={step.delay}
                                  />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeStep(step.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {index < steps.length - 1 && (
                          <div className="flex justify-center my-2">
                            <div className="w-px h-6 bg-border"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {steps.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma etapa adicionada ainda</p>
                      <p className="text-sm">Use o painel ao lado para adicionar etapas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowCreator;
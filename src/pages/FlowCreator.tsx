import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Clock, 
  MessageSquare,
  Plus,
  Zap
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StepItem, StepData } from '@/components/StepItem';
import { StepEditor } from '@/components/StepEditor';
import { onboardingApi } from '@/lib/api/integrations';

const FlowCreator = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [onboarding, setOnboarding] = useState<any>(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [steps, setSteps] = useState<StepData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingStep, setEditingStep] = useState<StepData | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load existing onboarding if editing
  useEffect(() => {
    if (id) {
      loadOnboarding();
    }
  }, [id]);

  const loadOnboarding = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await onboardingApi.getById(id);
      if (data) {
        setOnboarding(data);
        setFlowName(data.name);
        setSteps(data.steps.map((step: any) => ({
          id: step.id,
          type: step.type,
          content: step.content,
          order: step.order
        })));
      }
    } catch (error) {
      console.error('Error loading onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o fluxo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stepTypes = [
    { id: 'EMAIL', name: 'Enviar E-mail', icon: Send, color: 'text-blue-500' },
    { id: 'SMS', name: 'Enviar SMS', icon: MessageSquare, color: 'text-purple-500' },
    { id: 'TELEGRAM', name: 'Telegram', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'PUSH', name: 'Push Notification', icon: MessageSquare, color: 'text-red-500' },
    { id: 'DELAY', name: 'Adicionar Atraso', icon: Clock, color: 'text-orange-500' },
    { id: 'WHATSAPP_MSG', name: 'Mensagem WhatsApp', icon: MessageSquare, color: 'text-green-500' }
  ];

  const generateStepId = () => `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addStep = (type: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'PUSH' | 'DELAY' | 'WHATSAPP_MSG') => {
    const newStep: StepData = {
      id: generateStepId(),
      type,
      content: getDefaultContent(type),
      order: steps.length
    };
    setSteps([...steps, newStep]);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return { subject: '', message: '' };
      case 'SMS':
        return { phone: '', message: '' };
      case 'TELEGRAM':
        return { chat_id: '', message: '' };
      case 'PUSH':
        return { token: '', title: '', message: '' };
      case 'DELAY':
        return { delayInDays: 1 };
      case 'WHATSAPP_MSG':
        return { phone: '', message: '' };
      default:
        return {};
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEditStep = (step: StepData) => {
    setEditingStep(step);
    setIsEditorOpen(true);
  };

  const handleSaveStep = (updatedStep: StepData) => {
    setSteps(steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const handleSave = async () => {
    if (!flowName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do fluxo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let onboardingId = id;

      // Create new onboarding if not editing existing one
      if (!onboardingId) {
        const newOnboarding = await onboardingApi.create(flowName);
        onboardingId = newOnboarding.id;
      } else {
        // Update existing onboarding name
        await onboardingApi.update(onboardingId, { name: flowName });
      }

      // Save steps
      const stepsToSave = steps.map((step, index) => ({
        type: step.type,
        content: step.content,
        order: index
      }));

      await onboardingApi.saveSteps(onboardingId, stepsToSave);

      toast({
        title: "Fluxo salvo!",
        description: `O fluxo "${flowName}" foi salvo com sucesso.`,
      });
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o fluxo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando fluxo...</p>
        </div>
      </div>
    );
  }

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
                {id ? 'Editar Fluxo' : 'Criar Novo Fluxo'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure seu fluxo de onboarding
              </p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={saving} className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Fluxo'}
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
                  <div className="space-y-2 mt-2">
                    {stepTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addStep(type.id as any)}
                          className="w-full justify-start"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <Icon className={`w-4 h-4 mr-2 ${type.color}`} />
                          {type.name}
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
                  Arraste para reordenar e clique para editar as etapas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {steps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma etapa adicionada ainda</p>
                    <p className="text-sm">Use o painel ao lado para adicionar etapas</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={steps.map(s => s.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      {steps.map((step) => (
                        <StepItem
                          key={step.id}
                          step={step}
                          onEdit={handleEditStep}
                          onDelete={handleDeleteStep}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Step Editor Dialog */}
      <StepEditor
        step={editingStep}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingStep(null);
        }}
        onSave={handleSaveStep}
      />
    </div>
  );
};

export default FlowCreator;


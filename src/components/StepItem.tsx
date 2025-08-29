import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Mail, Clock, MessageSquare, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface StepData {
  id: string;
  type: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'PUSH' | 'DELAY' | 'WHATSAPP_MSG';
  content: any;
  order: number;
}

interface StepItemProps {
  step: StepData;
  onEdit?: (step: StepData) => void;
  onDelete?: (stepId: string) => void;
}

export const StepItem = ({ step, onEdit, onDelete }: StepItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'TELEGRAM':
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'PUSH':
        return <MessageSquare className="h-5 w-5 text-red-500" />;
      case 'DELAY':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'WHATSAPP_MSG':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTitle = (step: StepData) => {
    switch (step.type) {
      case 'EMAIL':
        return step.content.subject || 'Novo E-mail';
      case 'SMS':
        return `SMS: ${step.content.message?.substring(0, 30) || 'Nova mensagem'}${step.content.message?.length > 30 ? '...' : ''}`;
      case 'TELEGRAM':
        return `Telegram: ${step.content.message?.substring(0, 30) || 'Nova mensagem'}${step.content.message?.length > 30 ? '...' : ''}`;
      case 'PUSH':
        return step.content.title || 'Nova Push Notification';
      case 'DELAY':
        return `Aguardar por ${step.content.delayInDays || 1} dia(s)`;
      case 'WHATSAPP_MSG':
        return step.content.message ? 
          `WhatsApp: ${step.content.message.substring(0, 30)}...` : 
          'Nova Mensagem WhatsApp';
      default:
        return 'Etapa Desconhecida';
    }
  };

  const getDescription = (step: StepData) => {
    switch (step.type) {
      case 'EMAIL':
        return step.content.body || step.content.message ? 
          (step.content.body || step.content.message).substring(0, 100) + ((step.content.body || step.content.message).length > 100 ? '...' : '') :
          'Clique para editar o conteúdo do e-mail';
      case 'SMS':
        return step.content.message ? 
          step.content.message.substring(0, 100) + (step.content.message.length > 100 ? '...' : '') :
          'Clique para configurar o SMS';
      case 'TELEGRAM':
        return step.content.message ? 
          step.content.message.substring(0, 100) + (step.content.message.length > 100 ? '...' : '') :
          'Clique para configurar o Telegram';
      case 'PUSH':
        return step.content.message ? 
          step.content.message.substring(0, 100) + (step.content.message.length > 100 ? '...' : '') :
          'Clique para configurar a push notification';
      case 'DELAY':
        return `Pausa o fluxo por ${step.content.delayInDays || 1} dia(s) antes de continuar`;
      case 'WHATSAPP_MSG':
        return step.content.message ? 
          step.content.message.substring(0, 100) + (step.content.message.length > 100 ? '...' : '') :
          'Clique para editar a mensagem do WhatsApp';
      default:
        return 'Configuração necessária';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4"
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <button 
              {...attributes} 
              {...listeners}
              className="cursor-grab touch-none text-gray-400 hover:text-gray-600 p-1"
            >
              <GripVertical className="h-5 w-5" />
            </button>

            {/* Step Icon and Content */}
            <div className="flex-1 flex items-start gap-3">
              <div className="mt-1">
                {getIcon(step.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {getTitle(step)}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {getDescription(step)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(step)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(step.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


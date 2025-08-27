import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StepData } from './StepItem';

interface StepEditorProps {
  step: StepData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (step: StepData) => void;
}

export const StepEditor = ({ step, isOpen, onClose, onSave }: StepEditorProps) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (step) {
      setFormData(step.content || {});
    }
  }, [step]);

  const handleSave = () => {
    if (!step) return;

    const updatedStep: StepData = {
      ...step,
      content: formData
    };

    onSave(updatedStep);
    onClose();
  };

  const renderEmailEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subject">Assunto do E-mail</Label>
        <Input
          id="subject"
          value={formData.subject || ''}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Digite o assunto do e-mail"
        />
      </div>
      <div>
        <Label htmlFor="body">Conteúdo do E-mail</Label>
        <Textarea
          id="body"
          value={formData.body || ''}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Digite o conteúdo do e-mail"
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          Você pode usar variáveis como {`{{nome_do_cliente}}`} e {`{{email_do_cliente}}`}
        </p>
      </div>
    </div>
  );

  const renderDelayEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="delayInDays">Aguardar por quantos dias?</Label>
        <Input
          id="delayInDays"
          type="number"
          min="1"
          max="365"
          value={formData.delayInDays || 1}
          onChange={(e) => setFormData({ ...formData, delayInDays: parseInt(e.target.value) || 1 })}
        />
        <p className="text-xs text-gray-500 mt-1">
          O fluxo será pausado por este período antes de continuar para a próxima etapa
        </p>
      </div>
    </div>
  );

  const renderWhatsAppEditor = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="message">Mensagem do WhatsApp</Label>
        <Textarea
          id="message"
          value={formData.message || ''}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Digite a mensagem do WhatsApp"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          Você pode usar variáveis como {`{{nome_do_cliente}}`} e {`{{telefone_do_cliente}}`}
        </p>
      </div>
    </div>
  );

  const renderEditor = () => {
    if (!step) return null;

    switch (step.type) {
      case 'EMAIL':
        return renderEmailEditor();
      case 'DELAY':
        return renderDelayEditor();
      case 'WHATSAPP_MSG':
        return renderWhatsAppEditor();
      default:
        return <p>Tipo de etapa não suportado</p>;
    }
  };

  const getTitle = () => {
    if (!step) return 'Editar Etapa';
    
    switch (step.type) {
      case 'EMAIL':
        return 'Editar E-mail';
      case 'DELAY':
        return 'Editar Atraso';
      case 'WHATSAPP_MSG':
        return 'Editar Mensagem WhatsApp';
      default:
        return 'Editar Etapa';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditor()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


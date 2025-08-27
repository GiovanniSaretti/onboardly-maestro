import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanySettings {
  company_name: string;
  company_email: string;
  company_description: string;
  primary_color: string;
  logo_url?: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_reports: boolean;
}

export interface Integration {
  id?: string;
  integration_type: string;
  integration_name: string;
  webhook_url?: string;
  api_key?: string;
  status: 'available' | 'connected' | 'configured';
  config?: any;
}

export const useSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    company_name: '',
    company_email: '',
    company_description: '',
    primary_color: '#2563EB'
  });
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: false,
    weekly_reports: true
  });
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load company settings
      const { data: companyData } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (companyData) {
        setCompanySettings({
          company_name: companyData.company_name || '',
          company_email: companyData.company_email || '',
          company_description: companyData.company_description || '',
          primary_color: companyData.primary_color || '#2563EB',
          logo_url: companyData.logo_url || undefined
        });
      }

      // Load notification preferences
      const { data: notificationData } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (notificationData) {
        setNotificationPreferences({
          email_notifications: notificationData.email_notifications,
          push_notifications: notificationData.push_notifications,
          weekly_reports: notificationData.weekly_reports
        });
      }

      // Load integrations
      const { data: integrationsData } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id);

      if (integrationsData) {
        setIntegrations(integrationsData.map(item => ({
          id: item.id,
          integration_type: item.integration_type,
          integration_name: item.integration_name,
          webhook_url: item.webhook_url || undefined,
          api_key: item.api_key || undefined,
          status: item.status as 'available' | 'connected' | 'configured',
          config: item.config
        })));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive"
      });
    }
  };

  const saveCompanySettings = async (settings: CompanySettings) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('company_settings')
        .upsert({
          user_id: user.id,
          company_name: settings.company_name,
          company_email: settings.company_email,
          company_description: settings.company_description,
          primary_color: settings.primary_color,
          logo_url: settings.logo_url
        });

      if (error) throw error;

      setCompanySettings(settings);
      toast({
        title: "Sucesso!",
        description: "Configurações da empresa salvas com sucesso."
      });
    } catch (error) {
      console.error('Error saving company settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações da empresa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationPreferences = async (preferences: NotificationPreferences) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: preferences.email_notifications,
          push_notifications: preferences.push_notifications,
          weekly_reports: preferences.weekly_reports
        });

      if (error) throw error;

      setNotificationPreferences(preferences);
      toast({
        title: "Sucesso!",
        description: "Preferências de notificação salvas com sucesso."
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as preferências de notificação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const newSettings = { ...companySettings, logo_url: data.publicUrl };
      await saveCompanySettings(newSettings);

      toast({
        title: "Sucesso!",
        description: "Logo enviado com sucesso."
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o logo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveIntegration = async (integration: Omit<Integration, 'id'>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('integrations')
        .upsert({
          user_id: user.id,
          integration_type: integration.integration_type,
          integration_name: integration.integration_name,
          webhook_url: integration.webhook_url,
          api_key: integration.api_key,
          status: integration.status,
          config: integration.config || {}
        });

      if (error) throw error;

      await loadSettings(); // Reload to get updated data
      toast({
        title: "Sucesso!",
        description: `Integração ${integration.integration_name} configurada com sucesso.`
      });
    } catch (error) {
      console.error('Error saving integration:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a integração.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (integration: Integration) => {
    if (!integration.webhook_url) {
      toast({
        title: "Erro",
        description: "URL do webhook não configurada.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(integration.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          integration_type: integration.integration_type,
          message: "Teste de integração do Onboardly"
        }),
      });

      toast({
        title: "Teste Enviado",
        description: "O teste foi enviado. Verifique o histórico da sua integração para confirmar o recebimento.",
      });
    } catch (error) {
      console.error("Error testing integration:", error);
      toast({
        title: "Erro",
        description: "Falha ao testar a integração. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
    testIntegration,
    loadSettings
  };
};
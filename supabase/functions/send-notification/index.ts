import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'PUSH';
  recipient: string;
  subject?: string;
  message: string;
  data?: any;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
const firebaseKey = Deno.env.get('FIREBASE_SERVER_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipient, subject, message, data }: NotificationRequest = await req.json();
    
    console.log(`Sending ${type} notification to ${recipient}`);

    switch (type) {
      case 'EMAIL':
        await sendEmail(recipient, subject || 'Notification', message);
        break;
      case 'SMS':
        await sendSMS(recipient, message);
        break;
      case 'TELEGRAM':
        await sendTelegram(recipient, message);
        break;
      case 'PUSH':
        await sendPushNotification(recipient, subject || 'Notification', message, data);
        break;
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendEmail(to: string, subject: string, message: string) {
  const result = await resend.emails.send({
    from: 'Onboardly <onboarding@resend.dev>',
    to: [to],
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563EB;">${subject}</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Sent with ❤️ by Onboardly
        </p>
      </div>
    `,
  });
  console.log('Email sent:', result);
}

async function sendSMS(to: string, message: string) {
  if (!twilioSid || !twilioToken) {
    throw new Error('Twilio credentials not configured');
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: '+1234567890', // Replace with your Twilio number
      To: to,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }

  const result = await response.json();
  console.log('SMS sent:', result);
}

async function sendTelegram(chatId: string, message: string) {
  if (!telegramToken) {
    throw new Error('Telegram bot token not configured');
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram error: ${error}`);
  }

  const result = await response.json();
  console.log('Telegram message sent:', result);
}

async function sendPushNotification(token: string, title: string, body: string, data?: any) {
  if (!firebaseKey) {
    throw new Error('Firebase server key not configured');
  }

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${firebaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
        icon: '/favicon.ico',
      },
      data,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firebase error: ${error}`);
  }

  const result = await response.json();
  console.log('Push notification sent:', result);
}
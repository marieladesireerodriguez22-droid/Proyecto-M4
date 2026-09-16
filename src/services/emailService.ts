import { VercelRequest, VercelResponse } from '@vercel/node';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: to, subject, message' });
    }

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    // Si no hay credenciales locales, mockeamos controladamente para no crashear
    if (!accessKeyId || !secretAccessKey) {
      console.warn('AWS SES credentials missing. Simulated email send.');
      return res.status(200).json({
        success: true,
        message: 'Simulated email sent (AWS keys not configured locally)',
        mock: true,
      });
    }

    const sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new SendEmailCommand({
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Text: { Data: message } },
        Subject: { Data: subject },
      },
      Source: process.env.AWS_SENDER_EMAIL || to,
    });

    const response = await sesClient.send(command);
    return res.status(200).json({
      success: true,
      message: 'Correo enviado exitosamente a través de AWS SES',
      messageId: response.MessageId,
    });
  } catch (error: any) {
    console.error('Error al enviar correo con AWS SES:', error);
    return res.status(500).json({
      error: 'Error interno al enviar el correo',
      details: error.message,
    });
  }
}
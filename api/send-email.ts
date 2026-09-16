import { VercelRequest, VercelResponse } from '@vercel/node';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Inicializar el cliente de AWS SES con las credenciales de las variables de entorno
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Asegurarnos de que sea una petición POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos: to, subject, message' });
    }

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Data: message,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      // Este correo debe estar verificado en tu consola de AWS SES
      Source: process.env.AWS_SENDER_EMAIL || 'tucorreo@verificado.com', 
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
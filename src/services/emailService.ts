import { Task } from '../types/task';

export async function sendTasksSummaryEmail(to: string, tasks: Task[]): Promise<any> {
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const message = `
Resumen de tus tareas:
- Pendientes: ${pendingCount}
- Completadas: ${completedCount}
- Total: ${tasks.length}
  `.trim();

  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject: 'Resumen de tu Proyecto Integrador - M4',
      message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al enviar resumen de correo');
  }

  return response.json();
}
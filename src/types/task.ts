export interface Task {
  id?: string;               // ID único generado por Firestore (opcional al crear)
  title: string;             // Título de la tarea (obligatorio)
  description: string;       // Descripción detallada de la tarea
  completed: boolean;        // Estado de la tarea (completada o pendiente)
  userId: string;            // ID del usuario propietario (crucial para la seguridad y el filtro)
  createdAt?: any;           // Marca de tiempo opcional para ordenamiento
}
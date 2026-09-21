import React, { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { createTask, subscribeTasksByUser, updateTask, deleteTask } from '../services/taskService';
import { logoutUser } from '../services/authService';
import { sendTasksSummaryEmail } from '../services/emailService';

interface UserType {
  uid: string;
  email: string | null;
  [key: string]: unknown;
}

interface DashboardProps {
  user: UserType;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Estado para edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Suscripción en tiempo real con onSnapshot (Hito 6)
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeTasksByUser(user.uid, (userTasks) => {
      setTasks(userTasks);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user?.uid) return;

    await createTask(
      {
        title,
        description,
        completed: false,
        userId: user.uid,
      },
      user.uid
    );

    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = async (task: Task) => {
    if (!task.id) return;
    await updateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = async (taskId?: string) => {
    if (!taskId) return;
    await deleteTask(taskId);
  };

  const startEditing = (task: Task) => {
    if (!task.id) return;
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSaveEdit = async (taskId?: string) => {
    if (!taskId || !editTitle.trim()) return;
    await updateTask(taskId, {
      title: editTitle,
      description: editDescription,
    });
    setEditingId(null);
  };

  const handleSendEmailSummary = async () => {
    if (!user?.email) {
      alert('No se encontró el email del usuario.');
      return;
    }
    setIsSendingEmail(true);
    try {
      await sendTasksSummaryEmail(user.email, tasks);
      alert('¡Resumen de tareas enviado con éxito!');
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al enviar el correo: ${errMessage}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Mis Tareas</h2>
        <button onClick={() => logoutUser()} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Cerrar Sesión
        </button>
      </div>

      <p>Conectado como: <strong>{user?.email || 'Sin email'}</strong></p>

      <div style={{ margin: '15px 0' }}>
        <button
          onClick={handleSendEmailSummary}
          disabled={isSendingEmail}
          style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', opacity: isSendingEmail ? 0.6 : 1 }}
        >
          {isSendingEmail ? 'Enviando resumen...' : '✉️ Enviar resumen por email'}
        </button>
      </div>

      <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginTop: '15px' }}>
        <h3>Nueva Tarea</h3>
        <input
          type="text"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Guardar Tarea
        </button>
      </form>

      <div style={{ display: 'flex', gap: '10px', marginTop: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Filtrar:</span>
        <button
          onClick={() => setFilter('all')}
          style={{ padding: '6px 12px', background: filter === 'all' ? '#6c757d' : '#e2e6ea', color: filter === 'all' ? 'white' : 'black', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Todas ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{ padding: '6px 12px', background: filter === 'pending' ? '#ffc107' : '#e2e6ea', color: 'black', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Pendientes ({tasks.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{ padding: '6px 12px', background: filter === 'completed' ? '#28a745' : '#e2e6ea', color: filter === 'completed' ? 'white' : 'black', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Completadas ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {filteredTasks.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No hay tareas para mostrar en este filtro.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', flexDirection: 'column', padding: '12px', borderBottom: '1px solid #ddd', background: task.completed ? '#e8f5e9' : 'white', marginBottom: '8px', borderRadius: '4px', gap: '8px' }}>
              {editingId === task.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ padding: '6px' }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ padding: '6px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleSaveEdit(task.id)} style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Guardar</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '5px 10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{task.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleToggleComplete(task)} style={{ padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}>
                      {task.completed ? 'Desmarcar' : 'Completar'}
                    </button>
                    <button onClick={() => startEditing(task)} style={{ padding: '5px 8px', background: '#ffc107', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(task.id)} style={{ padding: '5px 8px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { createTask, getTasksByUser, updateTask, deleteTask } from '../services/taskService';
import { logoutUser } from '../services/authService';

interface DashboardProps {
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Cargar las tareas del usuario al iniciar la pantalla
  const fetchTasks = async () => {
    if (user) {
      const userTasks = await getTasksByUser(user.uid);
      setTasks(userTasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Manejar la creación de una tarea
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
    fetchTasks(); // Recargar la lista
  };

  // Cambiar estado de completado
  const handleToggleComplete = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
    fetchTasks();
  };

  // Eliminar tarea
  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Mis Tareas</h2>
        <button onClick={() => logoutUser()} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <p>Conectado como: <strong>{user.email}</strong></p>

      {/* Formulario para nueva tarea */}
      <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
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
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Guardar Tarea
        </button>
      </form>

      {/* Listado de tareas */}
      <div style={{ marginTop: '30px' }}>
        {tasks.length === 0 ? (
          <p>No tienes tareas creadas todavía.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd', background: task.completed ? '#e8f5e9' : 'white' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{task.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleToggleComplete(task)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                  {task.completed ? 'Desmarcar' : 'Completar'}
                </button>
                <button onClick={() => handleDelete(task.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
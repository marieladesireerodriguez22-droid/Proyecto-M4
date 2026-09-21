import { describe, it, expect } from 'vitest';
import { Task } from '../types/task';

describe('Filtro de tareas unitario', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'T1', description: 'Desc 1', completed: false, userId: 'u1' },
    { id: '2', title: 'T2', description: 'Desc 2', completed: true, userId: 'u1' },
  ];

  it('filtra correctamente las tareas pendientes', () => {
    const pending = mockTasks.filter((t) => !t.completed);
    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe('T1');
  });

  it('filtra correctamente las tareas completadas', () => {
    const completed = mockTasks.filter((t) => t.completed);
    expect(completed).toHaveLength(1);
    expect(completed[0].title).toBe('T2');
  });
});
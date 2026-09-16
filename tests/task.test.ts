import { describe, it, expect } from 'vitest';

describe('Filtro de tareas unitario', () => {
  it('filtra correctamente las tareas pendientes', () => {
    const tasks = [
      { id: '1', title: 'T1', description: '', completed: false, userId: 'u1' },
      { id: '2', title: 'T2', description: '', completed: true, userId: 'u1' },
    ];
    const pending = tasks.filter((t) => !t.completed);
    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe('T1');
  });
});
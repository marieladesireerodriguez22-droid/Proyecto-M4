import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { Task } from "../types/task";

const db = getFirestore();
const COLLECTION_NAME = "tasks";

// Crear una nueva tarea asociada al usuario actual
export const createTask = async (taskData: Omit<Task, "id" | "createdAt">, userId: string) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...taskData,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Obtener solo las tareas del usuario logueado
export const getTasksByUser = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  const tasks: Task[] = [];
  querySnapshot.forEach((docSnap) => {
    tasks.push({
      id: docSnap.id,
      ...docSnap.data()
    } as Task);
  });
  return tasks;
};

// Actualizar una tarea existente
export const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await updateDoc(taskDocRef, updatedData);
};

// Eliminar una tarea
export const deleteTask = async (taskId: string) => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await deleteDoc(taskDocRef);
};
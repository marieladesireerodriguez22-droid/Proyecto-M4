import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./firebase";
import { Task } from "../types/task";

const COLLECTION_NAME = "tasks";

export const createTask = async (taskData: Omit<Task, "id" | "createdAt">, userId: string) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...taskData,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

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

// Suscripción real-time (Hito 6)
export const subscribeTasksByUser = (userId: string, callback: (tasks: Task[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
  return onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnap) => {
      tasks.push({
        id: docSnap.id,
        ...docSnap.data()
      } as Task);
    });
    callback(tasks);
  });
};

export const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await updateDoc(taskDocRef, updatedData);
};

export const deleteTask = async (taskId: string) => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await deleteDoc(taskDocRef);
};
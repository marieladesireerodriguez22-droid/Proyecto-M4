import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./firebase";

// 1. Registro tradicional con email y contraseña
export const registerWithEmail = async (email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// 2. Login tradicional con email y contraseña
export const loginWithEmail = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

// 3. Login o Registro rápido con Google (Abre una ventana emergente)
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

// 4. Cerrar sesión
export const logoutUser = async () => {
  await signOut(auth);
};
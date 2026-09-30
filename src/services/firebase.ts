import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
};

// Inicializamos Firebase con nuestra configuración
const app = initializeApp(firebaseConfig);

// Exportamos auth y db centralizados
export const auth = getAuth(app);
export const db = getFirestore(app);
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // onAuthStateChanged es el "observador" de Firebase que escucha la sesión
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Ya sabemos si hay usuario o no, terminó de cargar
    });

    // Limpiamos la suscripción cuando el componente se desmonta (buena práctica)
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
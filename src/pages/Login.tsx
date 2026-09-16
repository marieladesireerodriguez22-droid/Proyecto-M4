import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // 🛠️ Función para traducir códigos de error de Firebase a mensajes claros
  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      default:
        return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
        alert('¡Usuario registrado con éxito!');
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      // Extraemos el código de error de Firebase (ej: auth/wrong-password)
      const errorCode = err.code || '';
      setError(getFriendlyErrorMessage(errorCode));
    }
  };

  // 🌟 Función para manejar el login con Google
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </button>
      </form>

      <div style={{ margin: '15px 0', textAlign: 'center' }}>o</div>

      {/* 🌟 Botón de Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{ width: '100%', padding: '10px', background: '#DB4437', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Continuar con Google
      </button>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline', display: 'block', width: '100%', textAlign: 'center' }}
      >
        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};
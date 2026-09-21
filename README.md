# Proyecto M4 - Gestor de Tareas SPA (React + TypeScript)

Aplicación Single Page Application (SPA) para la gestión de tareas de usuarios autenticados, desarrollada con React (Vite/TS), Firebase (Auth & Firestore), AWS SES (vía Serverless Functions en Vercel) y pruebas unitarias con Vitest.

---

## 📋 Descripción del Proyecto
Aplicación orientada a la productividad personal que permite la autenticación de usuarios, gestión completa de tareas (crear, leer, actualizar, completar/desmarcar, eliminar) con sincronización en tiempo real, filtrado por estados y envío de un resumen de tareas por correo electrónico mediante un servicio backend seguro.

---

## 🏛️ Decisiones Arquitectónicas
* **Arquitectura modular por capas**: Separación clara entre tipos (`src/types`), acceso a datos/servicios (`src/services`), lógica de sesión (`src/hooks`), enrutamiento protegido (`src/routes`) y vistas de UI (`src/pages`).
* **Unificación de Firebase**: Instancias de `auth` y `db` centralizadas en `src/services/firebase.ts` para evitar múltiples inicializaciones de la aplicación.
* **Persistencia en tiempo real**: Uso de Firestore con `onSnapshot` (`subscribeTasksByUser`) para reflejar cambios en la interfaz de forma reactiva sin recargar la página.
* **Backend serverless seguro**: Envío de correos delegado a una Serverless Function de Vercel (`api/send-email.ts`) utilizando `@aws-sdk/client-ses`, manteniendo las credenciales secretas de AWS fuera del bundle del frontend.

---

## 🚀 Instrucciones de Instalación
1. Clona el repositorio e instala dependencias:
   ```bash
   git clone [https://github.com/marieladesireerodriguez22-droid/Proyecto-M4.git](https://github.com/marieladesireerodriguez22-droid/Proyecto-M4.git)
   cd Proyecto-M4
   npm install
Configura tu archivo .env basado en la estructura requerida.

Inicia el entorno de desarrollo local:

Bash
npm run dev
Ejecuta las pruebas unitarias:

Bash
npm test
🔐 Variables de Entorno Necesarias
Crea un archivo .env en la raíz con las siguientes variables (prefijo VITE_ solo para las públicas de Firebase):

Fragmento de código
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_APP_ID=tu_app_id
(Nota para producción en Vercel: configurar además AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_SENDER_EMAIL directamente en el panel de Environment Variables de Vercel sin prefijo VITE_).

🌐 URL de Producción
Despliegue Vercel: https://proyectoint-git-58e9b1-marieladesireerodriguez22-3991s-projects.vercel.app/

✉️ Flujo de Envío de Emails
El usuario autenticado hace clic en "✉️ Enviar resumen por email" desde el Dashboard.

Se invoca sendTasksSummaryEmail(user.email, tasks), la cual realiza una petición POST al endpoint serverless /api/send-email.

La función serverless valida el método HTTP, extrae destinatario y tareas, inicializa el cliente SESClient con las credenciales de entorno de AWS y ejecuta SendEmailCommand.

Devuelve respuesta 200 al cliente confirmando el envío o gestiona errores en caso de fallo.

🤖 Integración de IA en el Proceso de Trabajo
Metodología de colaboración: Se utilizó asistencia de IA bajo una estrategia de auditoría modular y progresiva bloque por bloque (servicios, hooks, vistas, testing, despliegue) para evitar romper flujos funcionales existentes.

Situaciones de mayor efectividad:

Unificación y exportación centralizada de la instancia db de Firestore en firebase.ts.

Migración de consultas estáticas a tiempo real mediante onSnapshot (subscribeTasksByUser) para mantener la UI sincronizada de forma reactiva.

Separación estricta de responsabilidades de seguridad al mover la lógica de AWS SES a Vercel Serverless Functions (api/send-email.ts).

Patrones y buenas prácticas descubiertos:

Limpieza de suscripciones asíncronas retornando la función Unsubscribe de Firestore dentro de los useEffect para prevenir fugas de memoria (memory leaks).

Encapsulamiento de lógica asíncrona de UI y manejo defensivo de estados de carga (isSendingEmail, validación de campos vacíos en edición).

📦 Enlace al Repositorio de GitHub
https://github.com/marieladesireerodriguez22-droid/Proyecto-M4.git
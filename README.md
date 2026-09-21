# Proyecto Integrador M4 - Gestor de Tareas SPA (React + TypeScript)

Aplicación de Single Page Application (SPA) para la gestión de tareas de usuarios autenticados, desarrollada con React (Vite/TS), Firebase (Auth & Firestore), AWS SES (vía Serverless Functions en Vercel) y pruebas unitarias con Vitest.

---

## 📁 Estructura del Proyecto
```text
ProyectoIntegrador-M4/
├── api/
│   └── send-email.ts         # Función serverless para envío de correos vía AWS SES
├── src/
│   ├── components/           # Componentes UI reutilizables
│   ├── hooks/
│   │   └── useAuth.ts        # Hook para manejo de sesión y estado de autenticación (Firebase Auth)
│   ├── pages/
│   │   ├── Dashboard.tsx     # Vista principal (CRUD, tiempo real, filtros y envío de resumen)
│   │   └── Login.tsx         # Vista de autenticación
│   ├── routes/
│   │   └── ProtectedRoute.tsx# Protección de rutas basada en sesión activa
│   ├── services/
│   │   ├── authService.ts    # Lógica de autenticación
│   │   ├── emailService.ts   # Conector frontend hacia /api/send-email
│   │   ├── firebase.ts       # Inicialización centralizada de Firebase (auth & db)
│   │   └── taskService.ts    # Operaciones CRUD y tiempo real con Firestore (onSnapshot)
│   ├── types/
│   │   └── task.ts           # Definición de interfaz Task
│   ├── utils/                # Utilidades generales
│   ├── App.tsx               # Enrutador principal
│   └── main.tsx              # Punto de entrada de la SPA
├── tests/
│   └── task.test.ts          # Pruebas unitarias de filtrado con Vitest
├── .env / .env.example       # Variables de entorno
├── .gitignore                # Exclusión de credenciales y dependencias
├── vercel.json               # Configuración de despliegue para Vercel
└── package.json
🏛️ Decisiones Arquitectónicas
Arquitectura por capas: Separación clara entre tipos (src/types), acceso a datos/servicios (src/services), lógica de sesión (src/hooks), enrutamiento protegido (src/routes) y vistas (src/pages).

Unificación de Firebase: Instancias de auth y db centralizadas en src/services/firebase.ts para evitar múltiples inicializaciones de la app.

Persistencia y Tiempo Real: Uso de Firestore (onSnapshot en taskService.ts) para sincronización reactiva de las tareas del usuario logueado sin necesidad de recargar la página.

Backend ligero / Serverless: Envío de correos delegado a una Serverless Function de Vercel (api/send-email.ts) utilizando @aws-sdk/client-ses, manteniendo las credenciales secretas de AWS fuera del bundle del frontend.

🚀 Instrucciones de Instalación
Clona el repositorio e instala dependencias:

Bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoIntegrador-M4
npm install
Configura tu archivo .env basado en .env.example.

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
Despliegue Vercel: [PEGA_AQUI_TU_URL_DE_VERCEL]

✉️ Flujo de Envío de Emails
El usuario hace clic en "✉️ Enviar resumen por email" desde el Dashboard.tsx.

Se invoca sendTasksSummaryEmail(user.email, tasks), la cual realiza un POST fetch a la ruta serverless /api/send-email.

La función en api/send-email.ts valida el método HTTP (POST), extrae destinatario, asunto y cuerpo, inicializa SESClient con las credenciales de servidor de AWS y ejecuta SendEmailCommand.

Devuelve respuesta 200 al cliente con el MessageId o gestiona errores 400/500.

🤖 Integración de IA en el Proceso de Trabajo
Metodología de colaboración: Se aplicó una revisión de código iterativa, estricta y paso a paso por bloques funcionales (servicios -> hooks/routing -> vistas UI -> testing -> configuración de despliegue) para evitar regresiones lógicas o roturas en la API/servicios.

Situaciones de mayor efectividad:

Detección y corrección de la falta de una instancia exportada de db (Firestore) en firebase.ts.

Migración de consultas estáticas a tiempo real mediante onSnapshot (subscribeTasksByUser) para cumplir con la reactividad del Hito 6.

Validación de seguridad arquitectónica separando SDKs de AWS del frontend hacia la carpeta /api.

Patrones y buenas prácticas descubiertos:

Encapsular la lógica de suscripción asíncrona devolviendo la función Unsubscribe de Firestore para prevenir fugas de memoria (memory leaks) en el useEffect del componente Dashboard.

Blindar el enrutamiento y la validación de estados de carga (loading) en rutas protegidas (ProtectedRoute) antes de renderizar vistas privadas.

📦 Entregable Final
Repositorio GitHub: # Proyecto Integrador M4 - Gestor de Tareas SPA (React + TypeScript)

Aplicación de Single Page Application (SPA) para la gestión de tareas de usuarios autenticados, desarrollada con React (Vite/TS), Firebase (Auth & Firestore), AWS SES (vía Serverless Functions en Vercel) y pruebas unitarias con Vitest.

---

## 📁 Estructura del Proyecto
```text
ProyectoIntegrador-M4/
├── api/
│   └── send-email.ts         # Función serverless para envío de correos vía AWS SES
├── src/
│   ├── components/           # Componentes UI reutilizables
│   ├── hooks/
│   │   └── useAuth.ts        # Hook para manejo de sesión y estado de autenticación (Firebase Auth)
│   ├── pages/
│   │   ├── Dashboard.tsx     # Vista principal (CRUD, tiempo real, filtros y envío de resumen)
│   │   └── Login.tsx         # Vista de autenticación
│   ├── routes/
│   │   └── ProtectedRoute.tsx# Protección de rutas basada en sesión activa
│   ├── services/
│   │   ├── authService.ts    # Lógica de autenticación
│   │   ├── emailService.ts   # Conector frontend hacia /api/send-email
│   │   ├── firebase.ts       # Inicialización centralizada de Firebase (auth & db)
│   │   └── taskService.ts    # Operaciones CRUD y tiempo real con Firestore (onSnapshot)
│   ├── types/
│   │   └── task.ts           # Definición de interfaz Task
│   ├── utils/                # Utilidades generales
│   ├── App.tsx               # Enrutador principal
│   └── main.tsx              # Punto de entrada de la SPA
├── tests/
│   └── task.test.ts          # Pruebas unitarias de filtrado con Vitest
├── .env / .env.example       # Variables de entorno
├── .gitignore                # Exclusión de credenciales y dependencias
├── vercel.json               # Configuración de despliegue para Vercel
└── package.json
🏛️ Decisiones Arquitectónicas
Arquitectura por capas: Separación clara entre tipos (src/types), acceso a datos/servicios (src/services), lógica de sesión (src/hooks), enrutamiento protegido (src/routes) y vistas (src/pages).

Unificación de Firebase: Instancias de auth y db centralizadas en src/services/firebase.ts para evitar múltiples inicializaciones de la app.

Persistencia y Tiempo Real: Uso de Firestore (onSnapshot en taskService.ts) para sincronización reactiva de las tareas del usuario logueado sin necesidad de recargar la página.

Backend ligero / Serverless: Envío de correos delegado a una Serverless Function de Vercel (api/send-email.ts) utilizando @aws-sdk/client-ses, manteniendo las credenciales secretas de AWS fuera del bundle del frontend.

🚀 Instrucciones de Instalación
Clona el repositorio e instala dependencias:

Bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoIntegrador-M4
npm install
Configura tu archivo .env basado en .env.example.

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
El usuario hace clic en "✉️ Enviar resumen por email" desde el Dashboard.tsx.

Se invoca sendTasksSummaryEmail(user.email, tasks), la cual realiza un POST fetch a la ruta serverless /api/send-email.

La función en api/send-email.ts valida el método HTTP (POST), extrae destinatario, asunto y cuerpo, inicializa SESClient con las credenciales de servidor de AWS y ejecuta SendEmailCommand.

Devuelve respuesta 200 al cliente con el MessageId o gestiona errores 400/500.

🤖 Integración de IA en el Proceso de Trabajo
Metodología de colaboración: Se aplicó una revisión de código iterativa, estricta y paso a paso por bloques funcionales (servicios -> hooks/routing -> vistas UI -> testing -> configuración de despliegue) para evitar regresiones lógicas o roturas en la API/servicios.

Situaciones de mayor efectividad:

Detección y corrección de la falta de una instancia exportada de db (Firestore) en firebase.ts.

Migración de consultas estáticas a tiempo real mediante onSnapshot (subscribeTasksByUser) para cumplir con la reactividad del Hito 6.

Validación de seguridad arquitectónica separando SDKs de AWS del frontend hacia la carpeta /api.

Patrones y buenas prácticas descubiertos:

Encapsular la lógica de suscripción asíncrona devolviendo la función Unsubscribe de Firestore para prevenir fugas de memoria (memory leaks) en el useEffect del componente Dashboard.

Blindar el enrutamiento y la validación de estados de carga (loading) en rutas protegidas (ProtectedRoute) antes de renderizar vistas privadas.

Repositorio GitHub: https://github.com/marieladesireerodriguez22-droid/Proyecto-M4.git
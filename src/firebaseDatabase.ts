// src/firebaseDatabase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuração do projeto que contém o DATABASE (não o da autenticação!)
const firebaseDatabaseConfig = {
  apiKey: import.meta.env.VITE_DB_API_KEY,
  authDomain: import.meta.env.VITE_DB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_DATABASE_URL,
  projectId: import.meta.env.VITE_DB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_DB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_DB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_DB_APP_ID,
};

// 🔑 Dê um nome ao app para evitar conflito com o da autenticação
const databaseApp = initializeApp(firebaseDatabaseConfig, "databaseApp");

export const database = getDatabase(databaseApp);

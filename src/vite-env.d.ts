/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BASE_URL: string;
    // add other variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  

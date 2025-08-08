/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Adicione outras variáveis de ambiente conforme necessário
  readonly VITE_APP_TITLE?: string;
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  readonly VITE_STRIPE_SUCCESS_URL: string;
  readonly VITE_STRIPE_CANCEL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

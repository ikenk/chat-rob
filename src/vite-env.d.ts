/// <reference types="vite/client" />

declare module "vue-router";

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_BASE_API: string;
}

interface ImportMeta {
  readonly evn: ImportMetaEnv;
}

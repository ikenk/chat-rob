/// <reference types="vite/client" />

declare module 'vue-router'

interface ImportMetaEnv{
  readonly VITE_APP_ENV:String
  readonly VITE_APP_TITLE:String
  readonly VITE_APP_BASE_API:String
}
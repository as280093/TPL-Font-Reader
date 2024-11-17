/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string
  // Add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
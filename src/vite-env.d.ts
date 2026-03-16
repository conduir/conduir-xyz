/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POLKADOT_RPC_URL: string
  readonly VITE_POLKADOT_WS_URL: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly DISABLE_HMR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

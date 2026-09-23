/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_BUGSNAG_API_KEY?: string;
  readonly VITE_LOGROCKET_APP_ID?: string;
  readonly VITE_DATADOG_APPLICATION_ID?: string;
  readonly VITE_DATADOG_CLIENT_TOKEN?: string;
  readonly VITE_DATADOG_SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

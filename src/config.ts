const configuredBackendUrl = (import.meta.env.VITE_PORTFOLIO_API_URL || '').trim();

export const PORTFOLIO_API_URL =
  configuredBackendUrl.startsWith('https://script.google.com/macros/s/') &&
  configuredBackendUrl.endsWith('/exec')
    ? configuredBackendUrl
    : '';

export const hasLiveBackend = Boolean(PORTFOLIO_API_URL);

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\\/+/, '')}`;

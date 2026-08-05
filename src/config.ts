export const PORTFOLIO_API_URL =
  'PASTE_NEW_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE';

export const hasLiveBackend =
  PORTFOLIO_API_URL.startsWith('https://script.google.com/macros/s/') &&
  PORTFOLIO_API_URL.endsWith('/exec') &&
  !PORTFOLIO_API_URL.includes('PASTE_');

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

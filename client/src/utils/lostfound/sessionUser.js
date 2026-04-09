const USER_EMAIL_KEY = 'lf_user_email';
const ADMIN_AUTH_KEY = 'lf_admin_auth';

export const getCurrentUserEmail = () => {
  try {
    return String(localStorage.getItem(USER_EMAIL_KEY) || '').trim().toLowerCase();
  } catch {
    return '';
  }
};

export const setCurrentUserEmail = (email) => {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return;
  try {
    localStorage.setItem(USER_EMAIL_KEY, normalized);
  } catch {
    // Ignore storage errors for private mode or restricted environments.
  }
};

export const isAdminAuthenticated = () => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (value) => {
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false');
  } catch {
    // Ignore storage errors for private mode or restricted environments.
  }
};

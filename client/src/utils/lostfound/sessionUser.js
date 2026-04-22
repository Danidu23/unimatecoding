const USER_EMAIL_KEY = 'lf_user_email';

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
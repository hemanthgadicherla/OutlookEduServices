// Decode JWT payload without verifying signature (client-side only)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Returns decoded user from localStorage JWT merged with any local profile overrides.
// Overrides are written by setUserProfile() after a successful profile update so the
// name / avatar reflect the latest values without waiting for a new JWT.
export const getUser = () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) {
    // Token is malformed — clear it
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    return null;
  }

  // Check expiry
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    return null;
  }

  // Merge any locally-stored profile overrides (full_name, avatar_url, etc.)
  const overrides = getUserProfile();
  return overrides ? { ...decoded, ...overrides } : decoded;
};

// Store profile fields that should override the JWT payload until a new token is issued
export const setUserProfile = (fields) => {
  const existing = getUserProfile() || {};
  localStorage.setItem('userProfile', JSON.stringify({ ...existing, ...fields }));
  // Dispatch a custom event so any mounted component (e.g. Navbar) can react immediately
  window.dispatchEvent(new Event('userProfileUpdated'));
};

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem('userProfile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!getUser();

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('adminToken');
};

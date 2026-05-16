// Decode JWT payload without verifying signature (client-side only)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Returns decoded user from localStorage JWT, or null if missing/expired
export const getUser = () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Check expiry
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    return null;
  }

  return decoded; // { id, email, role }
};

export const isLoggedIn = () => !!getUser();

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('adminToken');
};

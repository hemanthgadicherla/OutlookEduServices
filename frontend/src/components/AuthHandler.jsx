// AuthHandler is no longer needed — OAuth callbacks are handled by
// AuthCallback.jsx (/auth/callback route) which receives the token
// from the backend redirect. This component is kept as a no-op
// to avoid breaking any existing imports.
const AuthHandler = () => null;
export default AuthHandler;

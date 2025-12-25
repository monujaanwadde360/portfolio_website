/* ---------- GET TOKEN ---------- */
export const getToken = () => {
  return localStorage.getItem("token");
};

/* ---------- DECODE JWT (SAFE) ---------- */
const decodePayload = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

/* ---------- CHECK AUTH ---------- */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const payload = decodePayload(token);
  if (!payload?.exp) return false;

  // exp is in seconds → convert to ms
  return payload.exp * 1000 > Date.now();
};

/* ---------- SAVE LOGIN ---------- */
export const login = (token) => {
  localStorage.setItem("token", token);
};

/* ---------- LOGOUT ---------- */
export const logout = () => {
  localStorage.removeItem("token");
  window.location.replace("/login"); // hard redirect (clears state)
};

/* ---------- OPTIONAL: USER ID ---------- */
export const getUserId = () => {
  const token = getToken();
  if (!token) return null;

  const payload = decodePayload(token);
  return payload?.id || null;
};

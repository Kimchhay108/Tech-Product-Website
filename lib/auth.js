// src/lib/auth.js
export const getAuth = () => {
  if (typeof window === "undefined") return null;

  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

export const login = (user, token = null) => {
  localStorage.setItem(
    "auth",
    JSON.stringify({ user, token, isLoggedIn: true })
  );
};

export const logout = () => {
  localStorage.removeItem("auth");
};

export const getRole = () => getAuth()?.user?.role || null;

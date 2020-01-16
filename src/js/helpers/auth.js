export const setLogin = (data, remember) => {
  data.current_time = new Date().getTime() / 1000;
  if (remember) {
    localStorage.setItem("auth", JSON.stringify(data));
  } else {
    sessionStorage.setItem("auth", JSON.stringify(data));
  }
};

export const logout = () => {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");
};

export const isAuthenticated = () =>
  localStorage.getItem("auth") || sessionStorage.getItem("auth");

export const getAuthToken = () => {
  return (
    JSON.parse(localStorage.getItem("auth")).token.access_token ||
    JSON.parse(sessionStorage.getItem("auth")).token.access_token
  );
};
